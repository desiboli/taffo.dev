import AutoScroll from "embla-carousel-auto-scroll"
import briccoLogo from "@/assets/bricco.svg"
import ingmarBergmanLogo from "@/assets/clients/ingmarbergman.svg"
import lakareUtanGranserLogo from "@/assets/clients/lakareutangranser.svg"
import rcoLogo from "@/assets/clients/rco.svg"
import stLogo from "@/assets/clients/st.svg"
import stadsmissionLogo from "@/assets/clients/stadsmission.svg"
import svtLogo from "@/assets/clients/svt.svg"
import unionenLogo from "@/assets/clients/unionen.svg"
import dinboxLogo from "@/assets/dinbox.webp"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const CLIENTS = [
  {
    id: 1,
    name: "Bricco",
    logo: briccoLogo,
  },
  {
    id: 2,
    name: "Dinbox",
    logo: dinboxLogo,
  },
  {
    id: 3,
    name: "Ingmar Bergman",
    logo: ingmarBergmanLogo,
  },
  {
    id: 4,
    name: "Läkare utan gränser",
    logo: lakareUtanGranserLogo,
  },
  {
    id: 5,
    name: "RCO Security",
    logo: rcoLogo,
  },
  {
    id: 6,
    name: "ST",
    logo: stLogo,
  },
  {
    id: 7,
    name: "Stadsmissionen",
    logo: stadsmissionLogo,
  },
  {
    id: 8,
    name: "SVT",
    logo: svtLogo,
  },
  {
    id: 9,
    name: "Unionen",
    logo: unionenLogo,
  },
]

export function ClientsCarousel() {
  const duplicatedClients = [
    ...CLIENTS,
    ...CLIENTS,
    ...CLIENTS,
    ...CLIENTS,
    ...CLIENTS,
  ]

  return (
    <Carousel
      className="w-full"
      opts={{
        loop: true,
        align: "start",
        dragFree: true,
      }}
      plugins={[
        AutoScroll({
          playOnInit: true,
          stopOnInteraction: false,
          startDelay: 0,
          speed: 1,
        }),
      ]}
    >
      <CarouselContent className="-ml-4">
        {duplicatedClients.map((client, index) => (
          <CarouselItem
            key={`${client.id}-${index}`}
            className="basis-auto pl-4"
          >
            <div className="p-4">
              <img
                src={client.logo.src}
                alt={client.name}
                className="h-8 w-auto grayscale transition-all duration-300 dark:invert"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
