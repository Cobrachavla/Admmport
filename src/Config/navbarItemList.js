import {
  LoginIcon,
  IdentificationIcon,
  UserIcon,
  ClipboardListIcon,
  HeartIcon,
  ShoppingCartIcon,
  HomeIcon,
  AcademicCapIcon, 
  InformationCircleIcon,
  MailIcon,
} from '@heroicons/react/outline'

const NAVIGATION = [
  {
    id: 1,
    name: "Login",
    link: "/signin",
    icon: <LoginIcon className="mr-2 my-auto h-5 w-5" aria-hidden="true" />,
    loggedIn: false,
    underlined: false,
  },
  {
    id: 2,
    name: "Sign Up",
    link: "/signup",
    icon: (
      <IdentificationIcon
        className="mr-2 my-auto h-5 w-5"
        aria-hidden="true"
      />
    ),
    loggedIn: false,
    underlined: true,
  },
  {
    id: 3,
    name: "Profile",
    link: "/profile",
    icon: <UserIcon className="mr-2 my-auto h-5 w-5" aria-hidden="true" />,
    loggedIn: true,
    underlined: true,
  },
  {
    id: 4,
    name: "Cart",
    link: "/cart",
    icon: (
      <ShoppingCartIcon className="mr-2 my-auto h-5 w-5" aria-hidden="true" />
    ),
    loggedIn: "public",
    underlined: false,
  },
  {
    id: 5,
    name: "Orders",
    link: "/orders",
    icon: (
      <ClipboardListIcon
        className="mr-2 my-auto h-5 w-5"
        aria-hidden="true"
      />
    ),
    loggedIn: true,
    underlined: false,
  },
  {
    id: 6,
    name: "Favorites",
    link: "/favorites",
    icon: <HeartIcon className="mr-2 my-auto h-5 w-5" aria-hidden="true" />,
    loggedIn: "public",
    underlined: true,
  },
  {
    id: 1,
    name: 'Home',
    link: '/',
    icon: <HomeIcon className="h-5 w-5 mr-2" aria-hidden="true" />,
    underlined: true,
    loggedIn: 'public',
    onclick: null,
  },
  {
    id: 2,
    name: 'Spotround Admissions',
    link: '/spotround-admissions',
    icon: <AcademicCapIcon className="h-5 w-5 mr-2" aria-hidden="true" />,
    underlined: true,
    loggedIn: 'public',
    onclick: null,
  },
  {
    id: 3,
    name: 'About Us',
    link: '/about',
    icon: <InformationCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />,
    underlined: true,
    loggedIn: 'public',
    onclick: null,
  },
  {
    id: 4,
    name: 'Contact Us',
    link: '/contact',
    icon: <MailIcon className="h-5 w-5 mr-2" aria-hidden="true" />,
    underlined: true,
    loggedIn: 'public',
    onclick: null,
  },
]

export default NAVIGATION