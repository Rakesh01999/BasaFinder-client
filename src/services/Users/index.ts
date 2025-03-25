"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

// ✅ Get all users
export const getAllUsers = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users`, {
      next: { tags: ["USERS"] },
    });

    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// ✅ Get single user
export const getSingleUser = async (userId: string) => {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/${userId}`, {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/${userId}`, {
      next: { tags: ["USERS"] },
    });

    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// ✅ Update User Profile
// export const updateUserProfile = async (profileData: FormData) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/update-profile`, {
//       method: "PATCH",
//       body: profileData,
//       headers: {
//         Authorization: (await cookies()).get("accessToken")!.value,
//       },
//     });
//     console.log(profileData);
//     revalidateTag("USERS");
//     return await res.json();
//   } catch (error: any) {
//     return Error(error.message);
//   }
// };
// Change the parameter type from FormData to the data object type
export const updateUserProfile = async (profileData: {
  name: string;
  email?: string;
  phone_number: string;
  address: string;
}) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/update-profile`, {
      method: "PATCH",
      body: JSON.stringify(profileData),
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    console.log(`${process.env.NEXT_PUBLIC_BASE_API}/update-profile`);
    console.log("Profile Data:", profileData);

    const responseData = await res.json();
    console.log("responseData:", responseData);

    if (!res.ok) {
      throw new Error(responseData.message || 'Profile update failed');
    }

    revalidateTag("USERS");
    return responseData;
  } catch (error: any) {
    console.error('Profile Update Error:', error);
    return { success: false, message: error.message };
  }
};

// ✅ Block User
export const blockUser = async (userId: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });

    revalidateTag("USERS");
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// ✅ Activate User
export const activateUser = async (userId: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });

    revalidateTag("USERS");
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// ✅ Change Password
export const changePassword = async (passwordData: { oldPassword: string; newPassword: string }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/change-password`, {
      method: "POST",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    console.log('passwordData:', passwordData);
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
// export const changePassword = async (passwordData: { 
//   currentPassword: string; 
//   newPassword: string 
// }) => {
//   try {
//     // Generate a hash that meets backend requirements
//     const generateHash = () => {
//       // Simple hash generation based on payload data
//       const salt = process.env.NEXT_PUBLIC_HASH_SALT || 'defaultSalt';
//       return btoa(JSON.stringify(passwordData) + salt + Date.now());
//     };

//     // Create payload matching backend structure
//     const payload = {
//       data: {
//         oldPassword: passwordData.currentPassword,
//         newPassword: passwordData.newPassword,
//         timestamp: new Date().toISOString(),
//         source: 'web-client'
//       },
//       hash: '' // We'll generate this next
//     };

//     // Generate hash after creating data object
//     payload.hash = generateHash();

//     console.log('Sending Payload:', payload);

//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/change-password`, {
//       method: "POST",
//       body: JSON.stringify(payload),
//       headers: {
//         Authorization: `${(await cookies()).get("accessToken")?.value}`,
//         "Content-Type": "application/json",
//       },
//     });
    
//     const response = await res.json();
//     console.log('Full Backend Response:', response);
    
//     return response;
//   } catch (error: any) {
//     console.error('Password Change Error:', error);
//     return { 
//       success: false, 
//       message: error.message || 'An unexpected error occurred' 
//     };
//   }
// };

// ✅ Calculate Revenue

export const calculateRevenue = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/payment/revenue`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });

    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
