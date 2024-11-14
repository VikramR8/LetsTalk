import { useAppStore } from "@/store/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { DELETE_IMAGE, HOST, PROFILE_IMAGE_ROUTE, UPDATED_INFO } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef=useRef(null)

  useEffect(()=>{
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstNAme)
      setLastName(userInfo.lastName)
      setSelectedColor(userInfo.color)
    }
    if(userInfo.image)
    {
      setImage(`${HOST}/${userInfo.image}`)
    }
  })

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };
  const saveChanges = async () => {
    if (validateProfile) {
      try {
        const res = await apiClient.post(
          UPDATED_INFO,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        console.log(res.data)
        if (res.status === 201 && res.data) {
          setUserInfo({ ...res.data });
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFileInputClick=()=>
  {
    fileInputRef.current.click()
  }

  const handleImageChange=async(event)=>{
    const file= event.target.files[0]
    console.log({file})
    if(file)
    {
      const formData=new FormData()
      formData.append('profile-image',file)
      const res=await apiClient.post(PROFILE_IMAGE_ROUTE, formData, {withCredentials:true})

    if(res===201 && res.data.image)
    {
      setUserInfo({...userInfo, image: res.data.image})
      toast.success("Image updated succesfully")
    }
    const reader= new FileReader()
    reader.onload=()=>{
      setImage(reader.result)
    }
    reader.readAsDataURL(file)   
  }
}

  const handleDeleteImage=async()=>{
    try {
      const res=await apiClient.delete(DELETE_IMAGE,{withCredentials:true})
      if(res===201)
      {
        setUserInfo({...userInfo,image:null})
        toast.success("Profile removed successfully")
        setImage(null)
      }
    } catch (error) {
      
    }
  }

  return (
    <div className="bg-white h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vh] md:w-max">
        <div>
          <IoArrowBack className="text-4xl lg:text-6xl text-black/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex justify-center items-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName && lastName
                    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer" onClick={image?handleDeleteImage:handleFileInputClick}>
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            {<input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp"/>}
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-white border-black text-black"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-white border-black text-black"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-white border-black text-black"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
                ${
                  selectedColor === index
                    ? "outline outline-black outline-1"
                    : ""
                }}`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-blue-500 hover:bg-blue-800 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Profile;
