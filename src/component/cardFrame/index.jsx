import { Card, CardContent, CardHeader } from "@suid/material";
import { mode } from "../../helper/_helper.theme";

import { Loading } from "../loading";

export const CardFrame = ({
  children,
  className,
  title,
  count,
  isLoading = true,
}) => {
  return (
    <Card
      sx={{
        bgcolor: mode() === "dark" ? "#171717" : "#fff",
        color: "white",
        border: mode() === "dark" ? `2px solid #222 ` : "2px solid #eee",
        borderRadius: 0,
        boxShadow: 0,
      }}
      class="flex flex-col flex-1 overflow-auto"
    >
      <CardHeader
        sx={{
          bgcolor: mode() === "dark" ? "#222" : "#aaa",
          padding: 1.2,
          paddingLeft: 2,
        }}
        titleTypographyProps={{
          fontSize: "14px",
        }}
        title={
          <div className="flex items-center gap-4 uppercase">
            <div className="relative w-full">
              {" "}
              {count ? count().data?.length || "" : ""} {title}
            </div>
          </div>
        }
      />
      <CardContent
        class={`${className} relative` || "relative"}
        sx={{
          fontSize: "16px",
        }}
      >
        {isLoading || isLoading() ? (
          children
        ) : (
          <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center">
            {<Loading></Loading>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
