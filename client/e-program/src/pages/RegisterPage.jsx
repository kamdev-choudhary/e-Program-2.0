import { useState } from "react";

export default function RegisterPage() {
  const [user, setUser] = useState({
    useraname: "",
    email: "",
    mobile: "",
    password: "",
  });
  return (
    <>
      <div className="container ">
        <div className="row">
          <div className="col-md-12">
            <div className="text-center">
              <img src="/brand-logo.jpg" alt="brand-logo" height="10%" />
            </div>
            <hr />
            <form>
              <div className="row border rounded p-2 ">
                <div class="form-group col-md-6 p-2">
                  <div className="input-group flex-nowrap rounded border border-success">
                    <span
                      className="input-group-text bg-success text-light"
                      id="addon-wrapping"
                    >
                      Full Name
                    </span>
                    <input className="form-control" type="text" name="" />
                  </div>
                </div>
                <div class="form-group col-md-6 p-2">
                  <div className="input-group flex-nowrap rounded border border-success">
                    <span
                      className="input-group-text bg-success text-light"
                      id="addon-wrapping"
                    >
                      Email
                    </span>
                    <input className="form-control" type="text" name="" />
                  </div>
                </div>
                <div class="form-group col-md-6 p-2">
                  <div className="input-group flex-nowrap rounded border border-success">
                    <span
                      className="input-group-text bg-success text-light"
                      id="addon-wrapping"
                    >
                      Mobile No.
                    </span>
                    <input className="form-control" type="text" name="" />
                  </div>
                </div>
                <div class="form-group col-md-6 p-2">
                  <div className="input-group flex-nowrap rounded border border-success">
                    <span
                      className="input-group-text bg-success text-light"
                      id="addon-wrapping"
                    >
                      Class
                    </span>
                    <input className="form-control" type="text" name="" />
                  </div>
                </div>
                <div class="form-group col-md-6 p-2">
                  <div className="input-group flex-nowrap rounded border border-success">
                    <span
                      className="input-group-text bg-success text-light"
                      id="addon-wrapping"
                    >
                      Password
                    </span>
                    <input className="form-control" type="text" name="" />
                  </div>
                </div>
                <div class="form-group col-md-6 p-2">
                  <div className="input-group flex-nowrap rounded border border-success">
                    <span
                      className="input-group-text bg-success text-light"
                      id="addon-wrapping"
                    >
                      Confirm Password
                    </span>
                    <input className="form-control" type="text" name="" />
                  </div>
                </div>
                <hr className="mt-2 mb-2" />
                <div className="submit-button text-center">
                  <button type="submit" class="btn btn-success">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
