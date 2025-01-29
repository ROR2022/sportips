

export const loginUser = async (email,password) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
}

export const forgotPassword = async (email) => {
    const res = await fetch(`/api/forgot?email=${email}`);
    return res.json();
}

export const resetPassword = async (dataRecovery) => {
    const res = await fetch("/api/recovery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataRecovery),
    });
    return res.json();
}

export const getUsers = async () => {
    const res = await fetch("/api/user");
    return res.json();
  };

  export const getUser = async (email) => {
    const res = await fetch(`/api/user?email=${email}`);
    return res.json();
  }
  
  export const createUser = async (data) => {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  };
  
  export const updateUser = async (data) => {
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  };

  // Update user data with form data (image)
  export const updateUserFormData = async (data) => {
    const res = await fetch("/api/user/form", {
      method: "PUT",
      body: data,
    });
    return res.json();
  };
  
  export const deleteUser = async (id) => {
    const res = await fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return res.json();
  };
  