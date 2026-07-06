import * as authService from "../services/authservice.js";
import { supabase } from "../lib/supabase.js";
import {
  signAuthToken,
  signRefreshToken,
  storeRefreshToken,
  revokeRefreshToken,
  isRefreshTokenValid,
  verifyAuthToken,
  getBearerToken,
} from "../utils/authToken.js";

async function sendAuthenticatedUser(res, user) {
  if (!user?.uid) {
    throw new Error("User uid is required to create authentication tokens");
  }

  const accessToken = signAuthToken(user);
  const refreshToken = signRefreshToken(user);

  try {
    await storeRefreshToken({ uid: user.uid, token: refreshToken.token, expiresAt: refreshToken.expiresAt });
  } catch (storeError) {
    console.error("Failed to store refresh token for uid:", user.uid, storeError.message);
    throw new Error(`Failed to store refresh token: ${storeError.message}`);
  }

  res.json({
    status: "success",
    user,
    token: accessToken,
    refreshToken: refreshToken.token,
  });
}

async function signup(req, res) {
  try {
    const user = await authService.signup(req.body);
    await sendAuthenticatedUser(res, user);
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}

async function login(req, res) {
  try {
    const user = await authService.login(req.body);
    await sendAuthenticatedUser(res, user);
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}

async function firebaseLogin(req, res) {
  try {
    const user = await authService.firebaseLogin(req.body);
    await sendAuthenticatedUser(res, user);
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}

async function logout(req, res) {
  try {
    const token = getBearerToken(req);
    const refreshTokenFromBody = req.body?.refreshToken || null;

    if (token) {
      try {
        verifyAuthToken(token);
      } catch {
        // ignore invalid token; still allow logout to clear client-side state
      }
    }

    if (refreshTokenFromBody) {
      await revokeRefreshToken(refreshTokenFromBody);
    }

    res.json({ status: "signed_out" });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}

async function saveUser(req, res) {
  try {
    const user = await authService.saveUser(req.body);
    await sendAuthenticatedUser(res, user);
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

async function refreshToken(req, res) {
  try {
    const { refreshToken: incoming } = req.body || {};
    if (!incoming) return res.status(400).json({ status: "error", message: "Refresh token required" });

    const user = await authService.verifyRefreshToken(incoming); // bcrypt compare + expiry check

    // revoke old token
    await revokeRefreshToken(incoming);

    // issue new refresh token
    const newRefresh = signRefreshToken(user);
    await storeRefreshToken({ uid: user.uid, token: newRefresh.token, expiresAt: newRefresh.expiresAt });

    const accessToken = signAuthToken(user);

    res.json({
      status: "success",
      token: accessToken,
      refreshToken: newRefresh.token,
      user,
    });
  } catch (err) {
    res.status(401).json({ status: "error", message: err.message });
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

async function updateStudentCourse(req, res) {
  try {
    const result = await authService.updateStudentCourse(req.body);
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
  refreshToken,
  saveUser,
  getUser,
  updateStudentProfile,
  updateStudentCourse
};
