"use client";

import { useState, useRef, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Loader2, Wallet, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStellarWithdrawal } from "@/hooks/useWithdrawal";
import { useTaskerWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import Image from "next/image";
import { isConnected, signTransaction, getAddress } from "@stellar/freighter-api";
import * as StellarSdk from "stellar-sdk";
import { server, NGNC_ISSUER_KEY, NETWORK_PASSPHRASE, IS_TESTNET } from "@/lib/stellar";

interface StellarWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "connect" | "amount" | "review" | "pin" | "success";

export function StellarWithdrawalModal({
  isOpen,
  onClose,
}: StellarWithdrawalModalProps) {
  const [step, setStep] = useState<Step>("connect");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [status, setStatus] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  const { mutate: withdraw, isPending: isWithdrawing } = useStellarWithdrawal();
  const { data: walletData } = useTaskerWallet();

  const withdrawableNGN = walletData?.withdrawableAmount || 0;

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep("connect");
      setAddress("");
      setAmount("");
      setPin(["", "", "", ""]);
      setStatus("");
      setWalletLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnectWallet = async () => {
    setWalletLoading(true);
    setStatus("Checking Freighter extension...");
    try {
      // 1. Check if Freighter is installed
      const connected = await isConnected();
      if (!connected) {
        toast.error("Freighter wallet not detected. Please install the Freighter extension.");
        setStatus("Freighter extension not found.");
        setWalletLoading(false);
        return;
      }

      // 2. Request Public Key
      setStatus("Connecting to Freighter...");
      const { address: userPublicKey, error: addressError } = await getAddress();
      if (addressError) throw new Error(addressError);
      if (!userPublicKey) {
        throw new Error("User rejected connection or public key not returned.");
      }
      setAddress(userPublicKey);

      // 3. Verify NGNC Trustline
      setStatus("Checking NGNC Trustline on Stellar network...");
      let account;
      try {
        account = await server.loadAccount(userPublicKey);
      } catch (err: any) {
        // Horizon throws 404 if the account is unfunded/new
        if (err?.response?.status === 404) {
          throw new Error("Your Stellar account is not active on the network. Please fund it with some XLM first.");
        }
        throw err;
      }

      const trustsNgnc = account.balances.some(
        (balance: any) =>
          balance.asset_code === "NGNC" && balance.asset_issuer === NGNC_ISSUER_KEY
      );

      // 4. Request trustline approval if missing
      if (!trustsNgnc) {
        setStatus("Approval required: Trusting NGNC asset...");
        const ngncAsset = new StellarSdk.Asset("NGNC", NGNC_ISSUER_KEY);

        const transaction = new StellarSdk.TransactionBuilder(account, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: NETWORK_PASSPHRASE,
        })
          .addOperation(
            StellarSdk.Operation.changeTrust({
              asset: ngncAsset,
            })
          )
          .setTimeout(30)
          .build();

        setStatus("Please sign the trustline transaction in Freighter...");
        const signResult = await signTransaction(transaction.toXDR(), {
          networkPassphrase: NETWORK_PASSPHRASE,
        });

        if (signResult.error) {
          throw new Error(signResult.error);
        }

        setStatus("Submitting Trustline to the blockchain...");
        const txToSubmit = StellarSdk.TransactionBuilder.fromXDR(
          signResult.signedTxXdr,
          NETWORK_PASSPHRASE
        );
        await server.submitTransaction(txToSubmit);
        toast.success("NGNC Trustline successfully established!");
      }

      // Automatically move to amount entry step
      setStep("amount");
      setStatus("");
    } catch (error: any) {
      console.error("Stellar Freighter connection error:", error);
      const errorMsg = error?.message || "Freighter connection or trustline verification failed.";
      setStatus(`Error: ${errorMsg}`);
      toast.error(errorMsg);
    } finally {
      setWalletLoading(false);
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto focus next
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const resetAndClose = () => {
    setStep("connect");
    setAddress("");
    setAmount("");
    setPin(["", "", "", ""]);
    setStatus("");
    onClose();
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.slice(-6)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] p-6 lg:p-8 w-full max-w-lg relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={resetAndClose}
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-900 transition-colors z-10 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="h-6 w-6" />
        </button>

        {step !== "success" && (
          <div className="text-center space-y-3 mb-8 mt-4">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
              Withdraw Via Stellar (NGNC)
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-medium px-4">
              Withdraw Naira directly as NGNC stablecoin using your Freighter Wallet
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* ── STEP: CONNECT ─────────────────────────────────────────────────── */}
          {step === "connect" && (
            <div className="flex flex-col items-center text-center space-y-6 py-4 animate-in fade-in duration-300">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-[#6B46C1] animate-pulse">
                <Wallet className="h-10 w-10" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-lg font-bold text-gray-900">Connect your Freighter Wallet</h3>
                <p className="text-sm text-gray-500">
                  Freighter connection ensures zero address typos and verifies your NGNC trustline automatically.
                </p>
              </div>

              {status && (
                <div className="w-full p-4 bg-purple-50/50 rounded-xl border border-purple-100/50 flex items-center justify-center gap-3">
                  {walletLoading && <Loader2 className="h-5 w-5 text-[#6B46C1] animate-spin" />}
                  <span className="text-sm text-purple-700 font-semibold">{status}</span>
                </div>
              )}

              <Button
                onClick={handleConnectWallet}
                disabled={walletLoading}
                className="w-full py-6 rounded-xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                {walletLoading ? "Connecting..." : "Connect Wallet"}
                {!walletLoading && <ArrowRight className="h-5 w-5" />}
              </Button>
            </div>
          )}

          {/* ── STEP: AMOUNT ──────────────────────────────────────────────────── */}
          {step === "amount" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              {/* Asset and Network Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-900 text-sm font-medium px-1">Asset</p>
                  <div className="w-full px-4 py-3 bg-[#F6F4FB] rounded-xl border border-[#EDEBFC]">
                    <span className="text-gray-700 font-semibold text-sm">NGNC</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-900 text-sm font-medium px-1">Network</p>
                  <div className="w-full px-4 py-3 bg-[#F6F4FB] rounded-xl border border-[#EDEBFC]">
                    <span className="text-gray-700 font-semibold text-sm">Stellar</span>
                  </div>
                </div>
              </div>

              {/* Wallet Info Banner */}
              <div className="w-full p-3.5 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-xs text-green-800 font-bold">Freighter Wallet Connected</span>
                </div>
                <span className="text-xs font-mono font-bold text-green-700">{formatAddress(address)}</span>
              </div>

              {/* Amount field */}
              <div className="space-y-2">
                <p className="text-gray-500 text-sm font-medium px-1">
                  Enter amount of NGNC to withdraw
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    ₦
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3.5 bg-[#F6F4FB] rounded-xl border border-[#EDEBFC] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/20 font-bold text-lg"
                  />
                </div>
                <div className="flex items-center justify-between px-1 mt-1">
                  <span className="text-gray-400 text-xs font-medium">Available balance: ₦{withdrawableNGN.toLocaleString()}</span>
                  <span className="text-gray-400 text-xs font-medium">Rate: 1 NGNC = ₦1</span>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <Button
                  onClick={() => setStep("connect")}
                  variant="outline"
                  className="flex-1 py-6 rounded-md border border-gray-100 bg-[#F6F4FB] text-gray-600 hover:bg-gray-200 font-medium text-base transition-all"
                >
                  Disconnect
                </Button>
                <Button
                  onClick={() => {
                    const ngncAmount = Number(amount);
                    if (!ngncAmount || ngncAmount < 500) {
                      toast.error("Minimum withdrawal is 500 NGNC (₦500)");
                      return;
                    }
                    if (ngncAmount > withdrawableNGN) {
                      toast.error("Insufficient withdrawable balance");
                      return;
                    }
                    setStep("review");
                  }}
                  disabled={!amount}
                  className="flex-1 py-6 rounded-md bg-[#6B46C1] hover:bg-[#553C9A] text-white font-medium text-base transition-all"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP: REVIEW ──────────────────────────────────────────────────── */}
          {step === "review" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-1 mb-8">
                <h3 className="text-2xl font-bold text-gray-900">₦{Number(amount).toLocaleString()}</h3>
                <p className="text-gray-400 text-sm font-medium">Amount you are withdrawing (NGNC)</p>
              </div>

              <div className="bg-[#F6F4FB] border border-[#EDEBFC] rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium text-sm">Asset</span>
                  <span className="text-gray-900 font-semibold text-sm">NGNC Stablecoin</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium text-sm">Network</span>
                  <span className="text-gray-900 font-semibold text-sm">Stellar Testnet</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-gray-400 font-medium text-sm shrink-0">Stellar Address</span>
                  <span className="text-gray-900 font-mono text-sm text-right break-all max-w-[200px]">
                    {address}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium text-sm">Trustline Status</span>
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-bold">
                    <CheckCircle2 size={12} /> Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium text-sm">Network Payout Fee</span>
                  <span className="text-green-600 font-semibold text-sm">Free</span>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <Button
                  onClick={() => setStep("amount")}
                  variant="outline"
                  className="flex-1 py-6 rounded-md border border-gray-100 bg-[#F6F4FB] text-gray-600 hover:bg-gray-200 font-medium text-base transition-all"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep("pin")}
                  className="flex-1 py-6 rounded-md bg-[#6B46C1] hover:bg-[#553C9A] text-white font-medium text-base transition-all"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP: PIN ─────────────────────────────────────────────────────── */}
          {step === "pin" && (
            <div className="animate-in slide-in-from-right-4 duration-300 text-center pb-2">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Transaction Pin</h3>
              <p className="text-gray-400 text-sm font-medium mb-8">Enter your 4-digit Transaction PIN</p>

              <div className="flex justify-center gap-3 mb-10">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={pinRefs[index]}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value.replace(/[^0-9]/g, ""))}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-14 h-14 bg-white border border-gray-200 rounded-lg text-center text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all "
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep("review")}
                  variant="outline"
                  className="flex-1 py-6 rounded-md border border-gray-100 bg-[#F6F4FB] text-gray-600 hover:bg-gray-200 font-medium text-base transition-all"
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    const ngncAmount = Number(amount);
                    withdraw(
                      {
                        amount: ngncAmount,
                        payoutMethod: "stellar_crypto",
                        stellarAddress: address,
                        transactionPin: pin.join(""),
                      },
                      {
                        onSuccess: () => {
                          setStep("success");
                        },
                        onError: (err: any) => {
                          const msg =
                            err?.response?.data?.message ||
                            err?.message ||
                            "Invalid PIN or withdrawal failed";
                          toast.error(msg);
                          setPin(["", "", "", ""]);
                          pinRefs[0].current?.focus();
                        },
                      }
                    );
                  }}
                  disabled={pin.join("").length < 4 || isWithdrawing}
                  className="flex-1 py-6 rounded-md bg-[#6B46C1] hover:bg-[#553C9A] text-white font-medium text-base transition-all"
                >
                  {isWithdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Withdraw"}
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP: SUCCESS ─────────────────────────────────────────────────── */}
          {step === "success" && (
            <div className="animate-in zoom-in duration-300 text-center py-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Withdrawal Successful
              </h2>
              <p className="text-gray-400 text-base font-medium mb-12">
                Your withdrawal request has been submitted successfully and will be processed soon.
              </p>

              <div className="flex justify-center mb-6">
                <Image src="/assets/check.png" alt="Success" width={200} height={200} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
