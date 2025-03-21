"use client";

import { useEffect, useState } from "react";
import NMContainer from "@/components/ui/core/NMContainer";
import { useUser } from "@/context/UserContext";
import { getSingleUser } from "@/services/Users";
import { IUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<IUser | null>(null);

  const fetchUserData = async () => {
    if (!user?.userId) return;

    const res = await getSingleUser(user.userId);
    if (res?.success) {
      setUserData(res.data);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?.userId]);

  if (!userData) {
    return (
      <NMContainer>
        <Skeleton className="h-60 w-full rounded-lg" />
        <Skeleton className="h-8 w-1/2 my-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-2/3" />
      </NMContainer>
    );
  }

  return (
    <NMContainer className="max-w-4xl mx-auto my-10 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg rounded-3xl">
      <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">
        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-blue-300">
          <AvatarImage src={userData.profileImg || "/user-placeholder.jpg"} />
          <AvatarFallback>{userData.name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800">{userData.name}</h2>
          <p className="text-gray-500">{userData.email}</p>
          <p className="text-sm text-blue-500 capitalize">{userData.role}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white shadow-sm rounded-xl">
          <p className="text-sm text-gray-600">Phone Number:</p>
          <p className="text-lg font-medium text-gray-800">{userData.phone_number || "N/A"}</p>
        </div>

        <div className="p-4 bg-white shadow-sm rounded-xl">
          <p className="text-sm text-gray-600">Address:</p>
          <p className="text-lg font-medium text-gray-800">{userData.address || "N/A"}</p>
        </div>

        <div className="p-4 bg-white shadow-sm rounded-xl">
          <p className="text-sm text-gray-600">Account Status:</p>
          <p className={`text-lg font-medium ${userData.isBlocked ? "text-red-500" : "text-green-500"}`}>
            {userData.isBlocked ? "Blocked" : "Active"}
          </p>
        </div>
      </div>

      {/* <div className="mt-8 flex justify-center md:justify-end gap-4"> */}
      <div className="mt-8 flex flex-col md:flex-row md:justify-end gap-4">
        <Button variant="outline" className="rounded-full px-6 py-2 hover:bg-blue-500 hover:text-white transition-all">
          Update Profile
        </Button>
        <Button className="text-white rounded-full px-6 py-2 hover:bg-blue-600 transition-all">
          Change Password
        </Button>
      </div>
    </NMContainer>
  );
};

export default ProfilePage;
