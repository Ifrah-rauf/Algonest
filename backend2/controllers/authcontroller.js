import * as authService from "../services/authservice.js";

async function signup(req, res) {
  try {
    const user = await authService.signup(req.body);
    req.session.user = user;
    res.json({ status: "success", user });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}

async function login(req, res) {
  try {
    const user = await authService.login(req.body);
    req.session.user = user;
    res.json({ status: "success", user });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}

async function firebaseLogin(req, res) {
  try {
    const user = await authService.firebaseLogin(req.body);
    req.session.user = user;
    res.json({ status: "success", user });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}

function logout(req, res) {
  req.session.destroy(() => res.json({ status: "signed_out" }));
}

async function saveUser(req, res) {
  try {
    const user = await authService.saveUser(req.body);
    res.json({ status: "created", user });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}

async function getUser(req, res) {
  try {
    const user = await authService.getUser(req.params.uid);
    res.json(user);
  } catch (err) {
    res.status(404).json({ status: "error", message: err.message });
  }
}

async function updateStudentProfile(req, res) {
  try {
    const result = await authService.updateStudentProfile(req.body);
    res.json({ status: "success", data: result });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}


export {
  signup,
  login,
  firebaseLogin,
  logout,
  saveUser,
  getUser,
  updateStudentProfile
};
