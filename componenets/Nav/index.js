const Nav = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-6 justify-center text-2xl">
        <li className="p-2">
          <a
            href="/post"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Trending
          </a>
        </li>
        <li className="p-2">
          <a
            href="/post"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            All Mooners
          </a>
        </li>
        <li className="p-2">
          <a
            href="/post"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            FAQ
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
