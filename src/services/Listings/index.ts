"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

// Create a listing
export const createListing = async (data: FormData) => {
  try {
    const res = await fetch(`${BASE_API}/landlords/listings`, {
      method: "POST",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      body: data,
    });

    revalidateTag("rentalListings");

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Get all listings
export const getAllListings = async (params = "") => {
  try {
    const res = await fetch(`${BASE_API}/landlords/listings${params}`, {
      next: {
        tags: ["rentalListings"],
      },
    });

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Get single listing
export const getSingleListing = async (listingId: string) => {
  try {
    const res = await fetch(`${BASE_API}/landlords/listings/${listingId}`, {
      next: {
        tags: ["rentalListings"],
      },
    });

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Update listing
export const updateListing = async (listingId: string, data: FormData) => {
  try {
    const res = await fetch(`${BASE_API}/landlords/listings/${listingId}`, {
      method: "PATCH",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      body: data,
    });

    revalidateTag("rentalListings");

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Delete listing
export const deleteListing = async (listingId: string) => {
  try {
    const res = await fetch(`${BASE_API}/landlords/listings/${listingId}`, {
      method: "DELETE",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });

    revalidateTag("rentalListings");

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
