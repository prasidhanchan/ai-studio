const Close = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      color={props.color || "currentColor"}
      {...props}
    >
      <path
        d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"
        stroke={props.color || "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default Close;
