import AutoScroll from "embla-carousel-auto-scroll"
import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const TESTIMONIALS = [
  {
    id: 1,
    name: "Jonas Fornander",
    testimonial:
      "I worked with Musse for over a year and highly recommend him. He combines strong frontend expertise with a great sense for design, takes ownership, and always delivers high-quality work on time. A positive and committed teammate I'd gladly work with again.",
  },
  {
    id: 2,
    name: "Mohammad Hafijur Rahman",
    testimonial:
      "I worked closely with Mustafa and was consistently impressed by his skills and dedication. He brings technical depth, UX thinking, and creative problem-solving to every project. A collaborative, reliable, and talented developer — highly recommended.",
  },
  {
    id: 3,
    name: "Jenny Hall",
    testimonial:
      "Musse is an experienced developer with natural leadership qualities and strong engagement. He brings structure, positive energy, and is truly enjoyable to work with. A valuable teammate in every setting.",
  },
  {
    id: 4,
    name: "Erik Lydecker",
    testimonial:
      "I worked with Mustafa for several years and he quickly became a key contributor. He pairs excellent frontend skills with precision, reliability, and great communication. Driven, quality-focused, and a colleague who lifts both product and team.",
  },
]

export function TestimonialCarousel() {
  const plugin = React.useRef(
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      startDelay: 0,
      speed: 1,
    })
  )

  return (
    <Carousel
      className="w-full"
      opts={{
        loop: true,
        align: "start",
        dragFree: true,
      }}
      plugins={[plugin.current]}
    >
      <CarouselContent>
        {TESTIMONIALS.map((testimonial) => (
          <CarouselItem
            key={testimonial.id}
            className="basis-full md:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-lg leading-relaxed md:text-xl">
                  {testimonial.testimonial}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {testimonial.name}
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
