import { useState, useRef } from "react";
import { FiCamera } from "react-icons/fi";
import { getUser } from "@/lib/auth";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function ProfileCard() {
  const currentUser = getUser();
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80"
  );
  const fileInputRef = useRef(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <Card className="flex flex-col items-center p-6 text-center">
      <div className="relative">
        <Avatar className="size-24">
          <AvatarImage src={profileImage} alt="Profile" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <button
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant hover:bg-primary/90"
        >
          <FiCamera className="size-4" />
        </button>
      </div>

      <h2 className="mt-4 text-base font-semibold">{currentUser?.name || "Guest"}</h2>
      <p className="text-xs text-muted-foreground">
        {currentUser?.role
          ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
          : ""}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Employee ID: {currentUser?.employee_id || "—"}
      </p>

      <Button variant="outline" size="sm" className="mt-4" onClick={() => fileInputRef.current.click()}>
        Change Photo
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </Card>
  );
}

export default ProfileCard;