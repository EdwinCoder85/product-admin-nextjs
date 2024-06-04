"use client";

import {
  CircleUserRound,
  FileText,
  ImagePlus,
  LifeBuoy,
  LoaderCircle,
  LogOut,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { fileToBase64 } from "@/actions/convert-file-to-base64";
import { signOutAccount, updateDocument, uploadBase64 } from "@/lib/firebase";
import toast from "react-hot-toast";
import Image from "next/image";
import { setInLocalstorage } from "@/actions/set-in-localstorage";

export function ProfileDropdown() {
  const user = useUser();
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // =============Choose a profile image========
  const chooseImage = async (event: any) => {
    const file = event.target.files?.[0];

    setIsLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const imagePath = `${user?.uid}/profile`;

      const imageUrl = await uploadBase64(imagePath, base64);

      await updateDocument(`users/${user?.uid}`, { image: imageUrl });

      setImage(imageUrl);

      if (user) {
        user.image = imageUrl;
        setInLocalstorage("user", user);
      }

      toast.success("Successfully updated");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(user?.image) setImage(user.image);
  }, [user])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="mr-2">Account</span>
          {image ? (
                <Image
                  className="object-cover w-6 h-6 rounded-full m-auto"
                  src={image}
                  width={1000}
                  height={1000}
                  alt="user-img"
                  priority={true}
                />
              ) : (
                <CircleUserRound className="m-auto w-6 h-6" />
              )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-center">
          {isLoading ? (
            <LoaderCircle className="w-14 h-14 animate-spin m-auto mb-3" />
          ) : (
            <>
              {image ? (
                <Image
                  className="object-cover w-20 h-20 rounded-full m-auto"
                  src={image}
                  width={1000}
                  height={1000}
                  alt="user-img"
                  priority={true}
                />
              ) : (
                <CircleUserRound className="m-auto w-20 h-20" />
              )}
              <div className="flex justify-center relative bottom-2">
                <input
                  id="files"
                  type="file"
                  className="hidden"
                  accept="image/png, image/webp, image/jpeg"
                  onChange={(event) => chooseImage(event)}
                />
                <label htmlFor="files">
                  <div className="w-[40px] h-[28px] cursor-pointer rounded-lg text-white bg-slate-950 hover:bg-slate-800 flex justify-center items-center">
                    <ImagePlus className="w-[18px] h-[18px]" />
                  </div>
                </label>
              </div>
              <div>{user?.name}</div>
            </>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Terms and Conditions</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOutAccount()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
