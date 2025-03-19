"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

// Get all rental requests (Admin or Landlord)
export const getAllRequests = async () => {
  try {
    const res = await fetch(`${BASE_API}/landlords/requests`, {
      next: {
        tags: ["rentalRequests"],
      },
    });

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Get rental requests for tenants
export const getTenantRequests = async () => {
  try {
    const res = await fetch(`${BASE_API}/tenants/requests`, {
      next: {
        tags: ["rentalRequests"],
      },
    });

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Get rental requests for landlords
export const getLandlordRequests = async () => {
  try {
    const res = await fetch(`${BASE_API}/landlord/requests`, {
      next: {
        tags: ["rentalRequests"],
      },
    });

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Create a rental request (Tenant only)
export const createRentalRequest = async (requestData: any) => {
  try {
    const res = await fetch(`${BASE_API}/tenants/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      body: JSON.stringify(requestData),
    });

    revalidateTag("rentalRequests");

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Update rental request status (Landlord/Admin only)
export const updateRequestStatus = async (requestId: string, status: string, landlordPhone?: string) => {
  try {
    const body: any = { status };
    if (landlordPhone) {
      body.landlordPhone = landlordPhone;
    }

    const res = await fetch(`${BASE_API}/requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      body: JSON.stringify(body),
    });

    revalidateTag("rentalRequests");

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
