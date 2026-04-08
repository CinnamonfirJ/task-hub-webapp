export interface MainCategory {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  mainCategory?: MainCategory;
  parentCategory?: string | MainCategory;
}

export interface University {
  _id: string;
  name: string;
  abbreviation: string;
  state: string;
  location?: string;
  logo?: string;
}

export interface NearbyTasker {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  averageRating: number;
  completedJobs: number;
  primaryCategory?: string;
  area?: string;
  residentState: string;
  distance?: number;
}
