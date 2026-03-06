import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const backendUrl = process.env.NEXT_PUBLIC_BASE_API;

    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BASE_API is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // 1. Validate the user session against the backend
    // We try common profile endpoints to get the userId securely
    const profileEndpoints = ["/api/auth/user", "/api/auth/tasker"];
    let userData = null;

    for (const endpoint of profileEndpoints) {
      try {
        const profileRes = await fetch(`${backendUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (profileRes.ok) {
          const resJson = await profileRes.json();
          userData = resJson.data || resJson.user || resJson.tasker || resJson;
          if (userData && (userData._id || userData.id)) break;
        }
      } catch (err) {
        console.error(`Error verifying auth with ${endpoint}:`, err);
      }
    }

    const userId = userData?._id || userData?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Could not verify user session" },
        { status: 401 },
      );
    }

    // 2. Call Didit to create a verification session
    const diditApiKey = process.env.NEXT_PUBLIC_DIDIT_API_KEY;
    const workflowId = process.env.NEXT_PUBLIC_DIDIT_WORKFLOW_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!diditApiKey || !workflowId) {
      console.error("Didit API credentials missing in environment variables");
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 },
      );
    }

    const payloadToDidit = {
      workflow_id: workflowId,
      callback: `${appUrl}/verification-complete`,
      vendor_data: String(userId),
    };

    console.log("Creating Didit session with payload:", payloadToDidit);

    const diditRes = await fetch("https://verification.didit.me/v3/session/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": diditApiKey,
      },
      body: JSON.stringify(payloadToDidit),
    });

    const diditData = await diditRes.json();

    if (!diditRes.ok) {
      console.error("Didit session creation failed:", diditData);
      return NextResponse.json(
        { error: "Failed to create verification session" },
        { status: diditRes.status },
      );
    }

    // 3. Return the verification URL to the frontend
    return NextResponse.json({
      verification_url: diditData.verification_url,
      session_id: diditData.session_id,
    });
  } catch (error: any) {
    console.error("Didit create-session error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
