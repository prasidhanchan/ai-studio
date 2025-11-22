const Edit = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M13.26 3.59924L5.04997 12.2892C4.73997 12.6192 4.43997 13.2692 4.37997 13.7192L4.00997 16.9592C3.87997 18.1292 4.71997 18.9292 5.87997 18.7292L9.09997 18.1792C9.54997 18.0992 10.18 17.7692 10.49 17.4292L18.7 8.73924C20.12 7.23924 20.76 5.52924 18.55 3.43924C16.35 1.36924 14.68 2.09924 13.26 3.59924Z"
        stroke="#fff"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.89 5.05078C12.32 7.81078 14.56 9.92078 17.34 10.2008"
        stroke="#fff"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Edit;
