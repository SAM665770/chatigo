import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { LoaderIcon } from "lucide-react";

// Create audio object for click sound feedback (loaded once when module loads)
const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile, isUpdatingProfilePic } =
    useAuthStore();

  const { isSoundEnabled, toggleSound } = useChatStore();
  // Local state to store selected image preview before upload
  const [selectedImg, setSelectedImg] = useState(null);

  // Reference to hidden file input element for programmatic triggering
  const fileInputRef = useRef(null);

  // Handle profile picture upload process
  const handleImageUpload = (e) => {
    // Get the first selected file from input
    const file = e.target.files[0];
    if (!file) return; // Exit if no file selected

    //Creates a FileReader instance (browser API for reading files)
    const reader = new FileReader();
    reader.readAsDataURL(file); // readAsDataURL() converts the file to a base64 string (data:image/jpeg;base64,...)

    // Callback when file reading is complete
    reader.onloadend = async () => {
      const base64Image = reader.result; // Get base64 string
      setSelectedImg(base64Image); // Update local preview
      await updateProfile({ profilePic: base64Image }); // Upload to server
    };

    // onloadend callback fires when file reading completes
    // reader.result contains the base64 string
    // setSelectedImg() updates local state for immediate preview
    // updateProfile() sends base64 to server for permanent storage

    // Flow:
    // User selects file → FileReader converts to base64 → Local preview updates → Server upload happens
    // Why base64? It allows sending image data as text in JSON requests without needing multipart form uploads.
  };

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar avatar-online">
          {/* useRef enables the clean UX where clicking the avatar opens file selection. */}
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">
                  {isUpdatingProfilePic ? (
                    <LoaderIcon className="size-5 animate-spin" />
                  ) : (
                    "Change"
                  )}
                </span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>

            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;
