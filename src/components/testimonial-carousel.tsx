import AutoScroll from "embla-carousel-auto-scroll"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const TESTIMONIALS = [
  {
    id: 1,
    name: "Jonas Fornander",
    role: "R&D Manager",
    testimonial:
      "I worked with Musse for over a year and highly recommend him. He combines strong frontend expertise with a great sense for design, takes ownership, and always delivers high-quality work on time. A positive and committed teammate I'd gladly work with again.",
  },
  {
    id: 2,
    name: "Mohammad Hafijur Rahman",
    role: "Senior Backend Developer",
    testimonial:
      "I worked closely with Mustafa and was consistently impressed by his skills and dedication. He brings technical depth, UX thinking, and creative problem-solving to every project. A collaborative, reliable, and talented developer — highly recommended.",
  },
  {
    id: 3,
    name: "Jenny Hall",
    role: "Product Manager",
    testimonial:
      "Musse is an experienced developer with natural leadership qualities and strong engagement. He brings structure, positive energy, and is truly enjoyable to work with. A valuable teammate in every setting.",
  },
  {
    id: 4,
    name: "Erik Lydecker",
    role: "AI Specialist",
    testimonial:
      "I worked with Mustafa for several years and he quickly became a key contributor. He pairs excellent frontend skills with precision, reliability, and great communication. Driven, quality-focused, and a colleague who lifts both product and team.",
  },
  {
    id: 5,
    name: "Hawre Ahmadi",
    role: "Senior Growth Manager",
    testimonial:
      "I worked with Musse on a project for a couple of months. He is a skilled frontend developer who delivers on his promises and shows genuine commitment to his work. He is also a good communicator and very easy to work with—a fantastic team player and colleague.",
  },
]

export function TestimonialCarousel() {
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS]

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
          stopOnMouseEnter: true,
          startDelay: 0,
          speed: 1,
        }),
      ]}
    >
      <CarouselContent>
        {duplicatedTestimonials.map((testimonial, index) => (
          <CarouselItem
            key={`${testimonial.id}-${index}`}
            className="basis-full md:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
          >
            <div className="p-1">
              <div className="flex flex-col gap-2 text-justify">
                <h2 className="text-lg font-medium leading-relaxed md:text-xl">
                  {testimonial.testimonial}
                </h2>
                <p className="text-muted-foreground text-sm flex flex-col">
                  <span className="font-medium">{testimonial.name}</span>
                  <span className="text-muted-foreground text-xs">{testimonial.role}</span>
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
