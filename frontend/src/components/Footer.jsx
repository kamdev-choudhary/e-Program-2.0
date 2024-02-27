import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="text-center bg-body-tertiary footer mt-auto py-3 bg-light">
        <div className="container pt-4">
          <section className="mb-4">
            <NavLink
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-facebook-f"></i>
            </NavLink>

            <NavLink
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-twitter"></i>
            </NavLink>

            <NavLink
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-google"></i>
            </NavLink>

            <NavLink
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-instagram"></i>
            </NavLink>

            <NavLink
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-linkedin"></i>
            </NavLink>
            <NavLink
              data-mdb-ripple-init
              className="btn btn-link btn-floating btn-lg text-body m-1"
              role="button"
              data-mdb-ripple-color="dark"
            >
              <i className="fab fa-github"></i>
            </NavLink>
          </section>
        </div>

        <div className="text-center p-3">
          © 2020 Copyright:
          <NavLink className="text-body">Dakshana.org</NavLink>
        </div>
      </footer>
    </>
  );
}
