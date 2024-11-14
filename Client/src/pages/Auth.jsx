import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/Logo.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import auth from "@/assets/Auth.png";
import { toast } from "sonner";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import apiClient from "@/lib/apiClient.js";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/store.js";

const iconVariants = (duration) => ({
  initial: { y: -10 },
  animate: {
    y: [10, -10],
    transition: {
      duration: duration,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
});

const Auth = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setIsShowConfirmPassword((prev) => !prev);
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm password should match.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const res = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (res.status === 201 && res.data.user.profileSetup) {
          setUserInfo(res.data.user);
          console.log(userInfo.email);
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      const res = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setUserInfo(res.data.user);
        navigate("/profile");
      }
    }
  };

  return (
    <div className="h-[100vh] w-[vw] flex items-center justify-center">
      <div className="h-[80vh] w-[80vw] bg-blue-200 border-2 border-blue-300 text-opacity-90 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <img src={logo} alt="Logo" className="h-[100px] mb-4" />
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
            </div>
            <p className="font-medium text-center">Bored? Let's Talk !!</p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full flex">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-400 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-400 p-3 transition-all duration-300"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-xl border-blue-300 p-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="relative flex items-center">
                  <Input
                    placeholder="Password"
                    type={isShowPassword ? "text" : "password"}
                    className="rounded-xl border-blue-300 p-5 pr-10" // Adjusted padding to fit the icon
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-4 cursor-pointer"
                    onClick={toggleShowPassword}
                  >
                    {isShowPassword ? (
                      <FaRegEye size={18} className="text-slate-800" />
                    ) : (
                      <FaRegEyeSlash size={18} className="text-slate-400" />
                    )}
                  </div>
                </div>

                <Button className="rounded-xl p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent className="flex flex-col gap-5 " value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-xl border-blue-300 p-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="relative flex items-center">
                  <Input
                    placeholder="Password"
                    type={isShowPassword ? "text" : "password"}
                    className="rounded-xl border-blue-300 p-5 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-4 cursor-pointer"
                    onClick={toggleShowPassword}
                  >
                    {isShowPassword ? (
                      <FaRegEye size={18} className="text-slate-800" />
                    ) : (
                      <FaRegEyeSlash size={18} className="text-slate-400" />
                    )}
                  </div>
                </div>
                <div className="relative flex items-center">
                  <Input
                    placeholder="Confirm Password"
                    type={isShowConfirmPassword ? "text" : "password"}
                    className="rounded-xl border-blue-300 p-5 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-4 cursor-pointer"
                    onClick={toggleShowConfirmPassword}
                  >
                    {isShowConfirmPassword ? (
                      <FaRegEye size={18} className="text-slate-800" />
                    ) : (
                      <FaRegEyeSlash size={18} className="text-slate-400" />
                    )}
                  </div>
                </div>
                <Button className="rounded-xl p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <motion.img
            src={auth}
            alt="Auth Page"
            variants={iconVariants(3)}
            initial="initial"
            animate="animate"
            className="mt-10"
          />
        </div>
      </div>
    </div>
  );
};
export default Auth;
