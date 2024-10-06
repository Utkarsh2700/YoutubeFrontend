import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { baseUrl } from "@/constants";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  LogOut,
  LucideMenu,
  // Mail,
  // MessageSquare,
  Mic,
  MonitorCog,
  Moon,
  MoonIcon,
  // PlusCircle,
  Search,
  Settings,
  SquarePen,
  Sun,
  User,
  VideoIcon,
  // Youtube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TbVideoPlus } from "react-icons/tb";
import { FaYoutube } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useTheme } from "@/contexts/ThemeContext";
// import { Button } from "./ui/button";

interface watchHistory {
  videos: string[];
}

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  watchHistory: watchHistory;
  createdAt: string;
  updatedAt: string;
}

interface ChildDropDownProps {
  icon: React.ReactNode;
  content: React.ReactNode;
}

function ChildDropDown({ icon, content }: ChildDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{icon}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black text-white">
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Header = () => {
  //Theme change

  const { setTheme } = useTheme();

  const [userDetails, setUserDetails] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const fetchUserDetaills = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/users/current-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data.data;
      // console.log("user", user);

      setUserDetails(user);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failure",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  // logout functionality
  const logout = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Logout",
        description: response.data.message ?? "Logged out",
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error while logging out at frontend", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserDetaills();
  }, [token]);

  return (
    token && (
      <div className="bg-black text-white flex items-center py-2 justify-between px-8 mr-4">
        <PageHeaderFirstSection hidden={showFullWidthSearch} />
        {/* <button className="menu cursor-pointer pl-[18px]" onClick={toggle}>
          <LucideMenu />
        </button>
        <div
          className="leftSideLogo flex items-center w-[30%] cursor-pointer"
          onClick={() => {
            navigate("/videos");
          }}
        >
          <img className="h-8 w-8 ml-8 mr-2" src="logo.svg" alt="" />
          <p className="font-semibold">Tweettube</p>
          </div> */}
        <div
          className={`centerSearchBar mx-8 px-4 flex items-center rounded-full w-full ${
            showFullWidthSearch ? "flex" : "hidden md:flex"
          }`}
        >
          {showFullWidthSearch && (
            <button
              onClick={() => setShowFullWidthSearch(false)}
              className="flex-shrink-0 text-white"
            >
              <ArrowLeft />
            </button>
          )}
          <div className="flex border-white border-[1px] rounded-full mx-4 overflow-hidden bg-[#818181] w-full justify-between">
            <input
              placeholder="Search"
              className="px-4 py-1.5 rounded-tl-full rounded-bl-full bg-[#212121] text-gray-500 outline-white pr-4 w-full"
            ></input>
            <span className="searchIcon bg-black p-2  rounded-tr-full rounded-br-full ">
              <Search className="cursor-pointer" />
            </span>
          </div>
          <span className="bg-gray-600 p-2 rounded-full cursor-pointer">
            <Mic />
          </span>
        </div>
        <div
          className={`settingsAvatarRight w-[30%]  justify-evenly flex items-center ${
            showFullWidthSearch ? "hidden" : "flex"
          }`}
        >
          <button
            onClick={() => setShowFullWidthSearch(true)}
            className="md:hidden text-white"
          >
            <Search />
          </button>
          <div className="videoAdd rounded-full p-2 flex items-center hover:bg-gray-700 cursor-pointer">
            <ChildDropDown
              icon={
                <div className="videoAdd rounded-full p-2 flex items-center hover:bg-gray-700 cursor-pointer">
                  <TbVideoPlus size={32} />
                </div>
              }
              content={
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <VideoIcon className="mr-2 h-4 w-4" />
                      <span
                        onClick={() => {
                          navigate("/videos/upload");
                        }}
                      >
                        Upload Video
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <SquarePen className="mr-2 h-4 w-4 " />
                      <span>Create Post</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              }
            />
          </div>
          <ChildDropDown
            icon={
              <Avatar className="cursor-pointer">
                <AvatarImage src={userDetails?.avatar} />
                <AvatarFallback>{userDetails?.fullName}</AvatarFallback>
              </Avatar>
            }
            content={
              <>
                <span className="flex items-center">
                  <img
                    src={userDetails?.avatar}
                    className="h-10 w-10 rounded-full"
                    alt={userDetails?.fullName}
                  />
                  <div className="ml-4 text-lg font-medium">
                    <h3>{userDetails?.fullName}</h3>
                    <h3>{userDetails?.username}</h3>
                  </div>
                </span>
                <p className="text-center text-blue-500 cursor-pointer text-sm">
                  View my Account
                </p>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <MoonIcon className="mr-2 h-4 w-4" />
                      <span>Appearence: Device Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-black text-white">
                        <DropdownMenuItem
                          onClick={() => {
                            console.log("system");
                            setTheme("system");
                          }}
                        >
                          <MonitorCog className="mr-2 h-4 w-4" />
                          <span>Device theme</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            console.log("dark");
                            setTheme("dark");
                          }}
                        >
                          <Moon className="mr-2 h-4 w-4" />
                          <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            console.log("light");
                            setTheme("light");
                          }}
                        >
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Light</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Send Feedback</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            }
          />
        </div>
      </div>
    )
  );
};

export default Header;

type PageHeaderFirstSectionProps = {
  hidden?: boolean;
};

export function PageHeaderFirstSection({
  hidden = false,
}: PageHeaderFirstSectionProps) {
  //function to toggle Sidebar
  const { toggle } = useSidebarContext();
  const navigate = useNavigate();
  return (
    <div
      className={`gap-4 items-center flex-shrink-0 bg-black text-white ${
        hidden ? "hidden" : "flex"
      }`}
    >
      <button className={`menu cursor-pointer pl-[18px]`} onClick={toggle}>
        <LucideMenu />
      </button>
      <div
        className="leftSideLogo flex items-center cursor-pointer"
        onClick={() => {
          navigate("/videos");
        }}
      >
        <FaYoutube
          className="w-8 h-8 fill-red-600 stroke-red-600 mr-2"
          size={32}
        />
        <p className="font-semibold">Tweettube</p>
      </div>
    </div>
  );
}
