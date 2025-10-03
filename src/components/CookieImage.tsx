import goldenCookieImg from "../assets/GoldCookie.png";
import wrathCookieImg from "../assets/WrathCookie.png";
const IMAGE_SIZE = 40;

type CookieType = "golden" | "wrath";

const config = {
  golden: {
    src: goldenCookieImg,
    alt: "Golden Cookie",
  },
  wrath: {
    src: wrathCookieImg,
    alt: "Wrath Cookie",
  },
} satisfies Record<CookieType, { src: string; alt: string }>;

export function CookieImage({ type }: { type: CookieType }) {
  return (
    <img
      src={config[type].src}
      alt={config[type].alt}
      width={IMAGE_SIZE}
      height={IMAGE_SIZE}
    />
  );
}
