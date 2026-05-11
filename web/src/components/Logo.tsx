interface LogoProps {
  className?: string
  /** Versão compacta sem o texto */
  iconOnly?: boolean
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={['flex items-center gap-2', className].filter(Boolean).join(' ')}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#2C46B1" />
        <path
          d="M11 12V20M11 16H17C18.1046 16 19 15.1046 19 14C19 12.8954 18.1046 12 17 12H11"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 16H18C19.1046 16 20 16.8954 20 18C20 19.1046 19.1046 20 18 20H11"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!iconOnly && (
        <span className="font-sans text-xl font-bold text-gray-600">brev.ly</span>
      )}
    </div>
  )
}
