interface CardProps {
  className?: string;
  imagepath?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}
export default function ContactCard({
  className = "",
  imagepath = "/",
  name = "Name",
  email = "Email",
  phone = "Telephone",
  address = "Address",
}: CardProps) {
  return (
    <div
      className={`${className} bg-[#fff] p-[4%] contact-card border-b-[6px] border-[#b0b0b0]`}
    >
      <div className="flex items-center gap-[4%]">
        <div className="left flex-[0_0_28%] w-[28%]">
          <img
            className="min-h-[150px] md:min-h-auto h-[100%] sm:h-[15vw] object-cover md:h-[15vw] lg:h-[10vw] w-[100%] bg-[#000000]"
            src={imagepath}
          ></img>
        </div>
        <div className="right flex-[0_0_60%] w-[60%] text-sm xl:text-base text-wrap">
          <div className="name font-bold">{name}</div>
          <div className="email">
            <a href={`mailto:${email}`}>{email}</a>
          </div>
          <div className="phone">
            <a href={`tel:${phone}`}>{phone}</a>
          </div>
          <div className="address">{address}</div>
        </div>
      </div>
    </div>
  );
}
