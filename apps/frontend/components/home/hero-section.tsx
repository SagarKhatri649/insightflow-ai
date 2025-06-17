import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";

export default function HeroSection(){
  return (
  <section>
    <div className="">
      <div className="flex">
          <div className="realtive p-[1px] overflow-hidden rounded-full bg-linear-to-r from-rose-200 vai-rose-500 to-rose-800 animate-gradient-x group">
            <Badge className="relative px-6 py-2 text-base font-medium bg-white rounded-full group-hover:bg-gray-50 transition-colors duration-200">
            <Sparkles className="h-6 w-6 mr-2 text-rose-200 animate-pulse " />
            <p className="text-base text-black">Power by AI</p>
            </Badge>
          </div>
       </div>
      
      <h1>jkfgkjsgnfgknsjkngs</h1>
      <h2>ujhfjasgrjfg a njgnangkangngdfjk</h2>
      <Button> Try Now</Button>

      </div>
  </section>
  )
}