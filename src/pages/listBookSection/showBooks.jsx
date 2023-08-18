import React, { useEffect, useMemo, useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { productListingStyle } from "./style";
import { materialCommonStyles } from "../../utils/materialCommonStyles";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from "@material-ui/core";
import { useAuthContext } from "../../context/auth";
import { toast } from "react-toastify";
import Shared from "../../utils/shared";
import { useCartContext } from "../../context/cart";
import { defaultFilter } from "../../constant/constant";
import bookService from "../../service/book.service";
import categoryService from "../../service/category.service";

const BookList = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const classes = productListingStyle();
  const materialClasses = materialCommonStyles();
  const [bookResponse, setBookResponse] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [filters, setFilters] = useState(defaultFilter);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookResponse(res);
    });
  };

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  const books = useMemo(() => {
    const bookList = [...bookResponse.items];
    if (bookList) {
      bookList.forEach((element) => {
        element.category = categories.find(
          (a) => a.id === element.categoryId
        )?.name;
      });
      return bookList;
    }
    return [];
  }, [categories, bookResponse]);

  const addToCart = (book) => {
    Shared.addToCart(book, authContext.user.id).then((res) => {
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        cartContext.updateCart();
      }
    });
  };

  const sortBooks = (e) => {
    setSortBy(e.target.value);
    const bookList = [...bookResponse.items];

    bookList.sort((a, b) => {
      if (a.name < b.name) {
        return e.target.value === "a-z" ? -1 : 1;
      }
      if (a.name > b.name) {
        return e.target.value === "a-z" ? 1 : -1;
      }
      return 0;
    });
    setBookResponse({ ...bookResponse, items: bookList });
  };
  console.log(bookResponse, books);
  return (
    <div className={classes.productListWrapper}>
      <div className="container">
      <h1 style={{ fontSize: "40px", textDecoration: "underline", fontFamily: "Times New Roman", textUnderlineOffset: "5px" }}>Book Listing</h1> <br /> <br />
        <Grid container className="title-wrapper">
          <Grid item xs={6}>
            <Typography variant="h2">
              Total
              <span>: {bookResponse.totalItems} item(s)</span>
            </Typography>
          </Grid>
          <div className="dropdown-wrapper">
            <TextField
              id="text"
              className="dropdown-wrapper"
              name="text"
              placeholder="Search any book here..."
              variant="outlined"
              inputProps={{ className: "small", style: {
                borderRadius: "10px"
              } }}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  keyword: e.target.value,
                  pageIndex: 1,
                });
              }}
            />
          </div>
          <FormControl className="dropdown-wrapper" variant="outlined">
            <InputLabel htmlFor="select">Sort By</InputLabel>
            <Select
              className={materialClasses.customSelect}
              MenuProps={{
                classes: { paper: materialClasses.customSelect },
              }}
              onChange={sortBooks}
              value={sortBy}
            >
              <MenuItem value="a-z">Ascending</MenuItem>
              <MenuItem value="z-a">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <div className="product-list-wrapper">
          <div className="product-list-inner-wrapper">
            {books.map((book, index) => (
              <div className="product-list" key={index}>
                <div className="product-list-inner">
                  <em>
                    <img
                      src={book.base64image}
                      className="image"
                      alt="dummyimage"
                    />
                  </em>
                  <div className="content-wrapper">
                    <h1 style={{fontFamily:"Lucida Handwriting", fontSize:"20px", fontWeight:"bold"}}>{book.name}</h1>
                    <span className="category">{book.category}</span>
                    <p className="description">{book.description}</p>
                    <p className="price">
                      <span className="discount-price" style={{color:"black"}}>
                        MRP &#8377;{book.price}
                      </span>
                    </p>
                    <button className=" MuiButton-root MuiButton-contained btn blue-btn MuiButton-containedPrimary">
                      <span
                        className="MuiButton-label"
                        onClick={() => addToCart(book)}
                      >
                        ADD TO CART
                      </span>
                      <span className="MuiTouchRipple-root"></span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <br/>
          <Pagination
            count={bookResponse.totalPages}
            page={filters.pageIndex}
            color="primary"
            onChange={(e, newPage) => {
              setFilters({ ...filters, pageIndex: newPage });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookList;
