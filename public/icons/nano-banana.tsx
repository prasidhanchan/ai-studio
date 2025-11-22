const NanoBanana = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-test-model-icon="gempix"
      {...props}
    >
      <path
        d="M4 12.9993C7.5 10.9993 12 10.9993 14 14.9993C14.8461 14.5673 15.7897 14.3618 16.7389 14.4029C17.688 14.444 18.6103 14.7303 19.4159 15.2338C20.2216 15.7373 20.883 16.4409 21.3359 17.276C21.7887 18.1112 22.0175 19.0494 22 19.9993"
        stroke="#2b7fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M5.15 17.89C10.67 16.37 13.8 11 12.15 5.89C11.55 4 11.5 2 13 2C16.22 2 18 7.5 18 10C18 16.5 13.8 22 7.51 22C5.11 22 2 22 2 20C2 18.5 3.14 18.45 5.15 17.89Z"
        stroke="#2b7fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default NanoBanana;
