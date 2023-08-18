import React, { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { headerStyle } from "./style";
import { Typography } from "@material-ui/core";
import "./Navbar.css"
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import ListItem from "@material-ui/core/ListItem";
import siteLogo from "../../assets/images/site-logo.svg";
import cartIcon from "../../assets/images/cart.png";
import searchIcon from "../../assets/images/search.png";
import { TextField, Button } from "@material-ui/core";
import Shared from "../../utils/shared";
import { useAuthContext } from "../../context/auth";
import { RoutePaths } from "../../utils/enum";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import bookService from "../../service/book.service";
import { useCartContext } from "../../context/cart";

const Header = () => {
  const classes = headerStyle();
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  // const [open, setOpen] = useState(false);
  const open = false;
  const [query, setquery] = useState("");
  const [bookList, setbookList] = useState([]);
  const [openSearchResult, setOpenSearchResult] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  const navigate = useNavigate();

  // for mobile menu
  const openMenu = () => {
    document.body.classList.toggle("open-menu");
  };

  const items = useMemo(() => {
    return Shared.NavigationItems.filter(
      (item) =>
        !item.access.length || item.access.includes(authContext.user.roleId)
    );
  }, [authContext.user]);

  const logOut = () => {
    authContext.signOut();
    cartContext.emptyCart();
  };

  const searchBook = async () => {
    const res = await bookService.searchBook(query);
    setbookList(res);
  };

  const search = () => {
    document.body.classList.add("search-results-open");
    searchBook();
    setOpenSearchResult(true);
  };

  const addToCart = (book) => {
    if (!authContext.user.id) {
      navigate(RoutePaths.Login);
      toast.error("Please login before adding books to cart");
    } else {
      Shared.addToCart(book, authContext.user.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Item added in cart");
          cartContext.updateCart();
        }
      });
    }
  };

  return (
    <nav>
      <Typography
        variant="h5"
        component="div"
        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, mr: 45 }}
        onClick={() => { navigate(`/`) }}
        style={{ cursor: "pointer", color: "black" }}
      >
        BooK Sell Project
      </Typography>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
      </div>
      {!authContext.user.id && (
        <ul className={menuOpen ? "open" : ""}>
          <li>
            <NavLink to={RoutePaths.Login} title="Login">
              Login
            </NavLink>
          </li>
          <li>
            <Link to={RoutePaths.Register} title="Register">
              Register
            </Link>
          </li>
        </ul>)
      }
      {
        items.map((item, index) => (
          <Link to={item.route} title={item.name}>
            {item.name}
          </Link>
        ))
      }
      <List>
        <ListItem >
          <Link to="/cart" title="Cart">
            <img src={cartIcon} alt="cart.png" />
            ({cartContext.cartData.length})
          </Link>
        </ListItem>
        <ListItem className="hamburger" onClick={openMenu}>
          <span></span>
        </ListItem>
      </List>
      {
        authContext.user.id && (
          <List className="right">
            <Button onClick={() => logOut()} variant="outlined">
              Log out
            </Button>
          </List>
        )
      }
    </nav >
  )
}
export default Header;
