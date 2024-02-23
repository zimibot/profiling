import { Button, Card, CardContent, CardHeader } from "@suid/material";
import { mode } from "../../helper/_helper.theme";
import { createEffect } from "solid-js";
import garis_dark from "../../assets/images/garis_dark.svg";
import { styled } from "solid-styled-components";
import { useAppState } from "../../helper/_helper.context";
import { Link, useLocation } from "@solidjs/router";

const Garis = styled("div")`
  background-image: url(${garis_dark});
  background-repeat-y: no-repeat;
  background-position: center;
  background-size: 11px;
`;
export const CardBox = ({
  title,
  children,
  className,
  headerComponent,
  isTabs,
}) => {
  const [state, { update }] = useAppState();

  createEffect(() => {
    update((d) => ({
      ...d,
      // tabs: tabsData || [],
      selectTab: d?.tabs?.filter((d) => d.active === true)[0],
    }));
  });

  createEffect(() => {
    console.log(state());
  });

  const navi = useLocation().pathname;
  let ds = navi.split("/")[4];

  return (
    <Card
      sx={{
        bgcolor: mode() === "dark" ? "#171717" : "#fff",
        color: "white",
        boxShadow: 0,
      }}
      class="flex flex-1 flex-col relative"
    >
      <CardHeader
        sx={{
          bgcolor: mode() === "dark" ? "#111111" : "#F1EFEF",
          padding: 1.2,
          paddingLeft: 2,
          boxShadow: 0,
        }}
        titleTypographyProps={{
          fontSize: "24px",
        }}
        title={
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="4" height="4" fill="#757575" />
                  <rect y="8" width="4" height="4" fill="#757575" />
                  <rect x="8" width="4" height="4" fill="#757575" />
                  <rect x="8" y="8" width="4" height="4" fill="#757575" />
                </svg>
              </div>
              <h4 className="flex">
                {" "}
                //{title}{" "}
                {state()?.terkait ? (
                  <span>
                    RELATED TO <b>{state()?.terkait}</b>
                  </span>
                ) : (
                  ""
                )}{" "}
              </h4>
            </div>
            {headerComponent}
          </div>
        }
      />
      {isTabs && (
        <div
          className={`${
            mode() === "dark" ? "bg-[#0D0D0D]" : "bg-[#F5F5F5]"
          } flex `}
        >
          <div className="pt-4 flex flex-1 gap-[2px]">
            {state()?.tabs?.map((d, k) => {
              let type =
                typeof d.display === "function"
                  ? d.display().getProfile
                  : d.display;

              return !type ? (
                ""
              ) : (
                <Link
                  activeClass="current_active"
                  inactiveClass="inActive"
                  href={d.path}
                >
                  <Button
                    onClick={() => {}}
                    class="!min-w-[150px]"
                    color="primary"
                    sx={{
                      bgcolor: mode() === "dark" ? "#202020" : "#fff",
                      borderRadius: 0,
                      // opacity: d.active ? 1 : "50%",
                      // fontWeight: d.active ? "bolder" : "normal"
                    }}
                  >
                    {d.title}
                  </Button>
                </Link>
              );
            })}

            <Garis class="flex-1" />
          </div>
        </div>
      )}
      <CardContent
        class={className || "relative"}
        sx={{
          fontSize: "16px",
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};
