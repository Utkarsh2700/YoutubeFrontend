import { baseUrl, categories } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import VideoItem from "@/components/VideoItem";
import Sidebar from "@/components/Sidebar";
import { CategoryPills } from "@/components/CategoryPills";
// import { SidebarProvider } from "@/contexts/SidebarContext";

interface OwnerDetails {
  _id: string;
  username: string;
  fullName: string;
  avatar: string;
}

interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: string;
  views: number;
  isPublished: boolean;
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  owner_details: OwnerDetails;
}

const Videos = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [videosFetched, setVideosFetched] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const token = localStorage.getItem("token");

  const getAllVideos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/videos`, {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });
      //   console.log(response);
      setVideosFetched(response.data.data);
      if (response.status === 200) {
        toast({
          title: "Videos Fetched",
          description: response.data.message,
          color: "white",
          className: "bg-green-600 text-white",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed Fetching Videos",
        description: errorMessage,
        className: "text-white bg-red-600",
      });
    }
    setIsLoading(false);
  };

  // For fetching all the videos initially
  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    // <SidebarProvider>
    <div className="max-h-screen flex flex-col">
      {/* <Header /> */}
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
        <Sidebar />
        <div className="overflow-x-hidden px-8 pb-4">
          <div className="sticky top-0 bg-black z-10 pb-4">
            <CategoryPills
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {videosFetched.map((video) => (
              <VideoItem key={video._id} {...video} />
            ))}
          </div>
        </div>
      </div>
      {/* <Container>
        <div className="bg-gray-900 text-white flex flex-wrap justify-evenly space-y-2">
          {!isLoading &&
            videosFetched.map((video) => (
              <div
                key={video._id}
                className="rounded-lg shadow-lg flex flex-wrap w-[30%] mx-2 mt-4 cursor-pointer"
              >
                <div className="image w-full rounded-lg">
                  <div className="imageContainer relative">
                    <img
                      src={video.thumbnail}
                      className="object-cover w-full h-[250px] rounded-lg"
                      alt=""
                    />
                    <span className="duration absolute right-[8%] bottom-[15%] px-2 rounded-md bg-[#000000]/50 text-white">
                      {formatVideoDuration(+video.duration)}
                    </span>
                  </div>
                  <div className="flex mt-2">
                    <img
                      src={video.owner_details.avatar}
                      className="rounded-full w-8 h-8 mr-4 "
                      alt=""
                    />
                    <h3>{video.title}</h3>
                  </div>
                  <div className="justify-between text-gray-400 ml-12">
                    <div className="owner">
                      <h3 className="text-sm">
                        {video.owner_details.fullName}
                      </h3>
                    </div>
                    <div className="flex items-center">
                      <p className="views text-sm ">{` ${video.views} views`}</p>
                      <p className="mx-1">•</p>
                      <p className="posted-time text-sm ml-1">
                        {formatTimeSincePosted(video.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Container> */}
    </div>
    // </SidebarProvider>
  );
};

export default Videos;
