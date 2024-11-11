export const SIGNUP_USER = "SIGNUP_USER";
export const LOGIN_USER = "LOGIN_USER";
export const GENERATE_CV = "GENERATE_CV";
export const FETCH_CVS = "FETCH_CVS";
export const UPDATE_USER = "UPDATE_USER";
export const OPEN_CV = "OPEN_CV";
export const UPDATE_CV = "UPDATE_CV";

//pure functions to calculate the time remaining

let calculateRemainingTime = (expiryDate) => {
  //getting current time in milliseconds
  const currentTime = new Date().getMilliseconds()
  //getting expiration time in milliseconds
  const adjustExpirationTime = (expiryDate * 60 * 60 * 1000)
  const timeLeft = adjustExpirationTime - currentTime
  return timeLeft
}


let retrievedAdminStoredToken = () => {
  let tokenFromStorage = localStorage.getItem('token')
  let expiryDate = localStorage.getItem('expiry')
  const timeLeft = calculateRemainingTime(expiryDate)

  if (timeLeft <= 3600) {
    localStorage.removeItem('token')
    localStorage.removeItem('expiry')
    localStorage.removeItem('user')

    return {
      adminToken: "",
      adminExpiresIn: ""
    }
  }

  return {
    adminToken: tokenFromStorage,
    adminExpiresIn: timeLeft
  }
}

/*   user sections */
export const signup = (data) => {
  let objData = data
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`http://localhost:8080/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
          url: '/signup'
        }
      }
      if (response.status === 300) {
        let data = await response.json()

        return {
          bool: false,
          message: data.response,
          url: '/signup'
        }
      }
      if (response.status === 301) {
        let data = await response.json()

        return {
          bool: false,
          message: data.response,
          url: '/login'
        }
      }

      if (response.status === 200) {
        let data = await response.json()



        localStorage.setItem("user", JSON.stringify(data.user))

        localStorage.setItem("user_token", JSON.stringify(data.userToken))

        localStorage.setItem("user_expiry", JSON.stringify(data.userExpiresIn))

        let payloadData = {
          user: data.user,
          userToken: data.userToken,
          userExpiresIn: data.userExpiresIn

        }
        dispatch({ type: LOGIN_USER, payload: payloadData })

        return {
          bool: true,
          message: data.response,
          url: `/login`
        }
      }
    } catch (err) {
      return {
        bool: false,
        message: "network error",
        url: '/signup'
      }

    }

  }

}

export const login = (data) => {
  return async (dispatch, getState) => {
    let userData = data
    //do some check on the server if its actually login before proceding to dispatch
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
          url: "/login"
        }
      }
      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
          url: "/login"
        }
      }
      if (response.status === 200) {
        let data = await response.json()

        localStorage.setItem("user", JSON.stringify(data.response.user))

        localStorage.setItem("user_token", JSON.stringify(data.response.userToken))

        localStorage.setItem("user_expiry", JSON.stringify(data.response.userExpiresIn))

        dispatch({ type: LOGIN_USER, payload: data.response })
        return {
          bool: true,
          //data here refers to user and dispatch
          message: data.response.message,
          url: `/template`
        }
      }

    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}

export const makeCv = (data) => {
  return async (dispatch, getState) => {
    try {
      const { userAuth } = getState();
      // Access specific slice of the state
      const response = await fetch(`http://localhost:8080/makecv/${userAuth.user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      if (response.status === 404) {
      
        let data = await response.json()
        return {
          bool: false,
          message: data.message,
        }
      }
      if (response.status === 300) {
       
        let data = await response.json()
        return {
          bool: false,
          message: data.message,
        }
      }

      if (response.status === 200) {
        
        let data = await response.json()
        dispatch({ type: GENERATE_CV, payload: data })
        return {
          bool: true,
          message: data.message,
        }
      }
    } catch (err) {
      
      return {
        bool: false,
        message: "network error",
      }

    }

  }

}

export const updateCv = (data) => {
  return async (dispatch, getState) => {
    try {
      const { userAuth } = getState(); // Access user authentication data
      const response = await fetch(`http://localhost:8080/updatecv/${userAuth.user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.status === 404 || response.status === 300) {
        // Handle specific error responses from the server
        const errorData = await response.json();
        return {
          bool: false,
          message: errorData.message,
        };
      }

      if (response.status === 200) {
        // Success: parse the data and update the store
        const updatedCvData = await response.json();
        dispatch({ 
          type: UPDATE_CV, 
          payload: {
            id: userAuth.user._id, // or use the specific CV's ID if different
            data: updatedCvData.cv
          }
        });
        
        return {
          bool: true,
          message: "CV updated successfully",
        };
      }

      // Handle unexpected status codes
      return {
        bool: false,
        message: "Unexpected error",
      };

    } catch (err) {
      // Network or other errors
      return {
        bool: false,
        message: "Network error",
      };
    }
  };
};




export const fetchCv = (id) => {
  return async (dispatch, getState) => {
    //do some check on the server if its actually login before proceding to dispatch
    try {
      const response = await fetch(`http://localhost:8080/cvs/${id}`)
      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 200) {
        let data = await response.json()

        dispatch({ type: FETCH_CVS, payload: data.cvs })
        return {
          bool: true,
          message: data.cvs,
        }
      }

    } catch (err) {
      return {
        bool: false,
        message: "network error"
      }
    }
  }
}



export const openCv = (data) => {
  return async (dispatch, getState) => {
    dispatch({ type: OPEN_CV, payload: data })
  }

}



export const updateUser = (data) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`http://localhost:8080/updateaccount/${data._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      if (response.status === 404) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }
      if (response.status === 300) {
        let data = await response.json()
        return {
          bool: false,
          message: data.response,
        }
      }

      if (response.status === 200) {
        let data = await response.json()
        /// 

        dispatch({ type: UPDATE_USER, payload: data.user })

        return {
          bool: true,
          message: data,
        }
      }
    } catch (err) {
      return {
        bool: false,
        message: "network error",
      }

    }

  }

}






