const Check = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      color="#ffffff"
      {...props}
    >
      <path
        d="M2.5 13.8333L6 17.5L7.02402 16.4272M16.5 6.5L10.437 12.8517"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M7.5 13.8333L11 17.5L21.5 6.5"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default Check;
