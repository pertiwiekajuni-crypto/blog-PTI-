import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// Ganti konfigurasi ini dengan data dari Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyDdmMCTD1nPoG0COfkUc3Qr5rPEVflj0gXw",
  authDomain: "logiclab-comments.firebaseapp.com",
  projectId: "logiclab-comments",
  storageBucket: "logiclab-comments.firebasestorage.app",
  messagingSenderId: "204407492319",
  appId: "1:204407492319:web:008865be71e1ab9c66a36a",
  measurementId: "G-HND8BQ8JDQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("commentForm");
const nameInput = document.getElementById("commentName");
const messageInput = document.getElementById("commentMessage");
const status = document.getElementById("commentStatus");
const list = document.getElementById("commentList");
const count = document.getElementById("commentCount");

if (form && nameInput && messageInput && status && list && count) {
  const commentsRef = collection(db, "comments");

  function showStatus(message, error = false) {
    status.textContent = message;
    status.style.color = error ? "#fca5a5" : "#7dd3fc";
  }

  function displayDate(timestamp) {
    if (!timestamp) return "Baru saja";
    return timestamp.toDate().toLocaleString("id-ID");
  }

  function showComments(snapshot) {
   count.textContent = `${snapshot.size} komentar`;
    list.replaceChildren();

    if (snapshot.empty) {
      const empty = document.createElement("div");
      empty.className = "comment-empty";

      const title = document.createElement("p");
      title.textContent = "Belum ada komentar.";

      const note = document.createElement("small");
      note.textContent = "Jadilah orang pertama yang berdiskusi!";

      empty.append(title, note);
      list.append(empty);
      return;
    }

    snapshot.forEach((item) => {
      const data = item.data();

      const card = document.createElement("article");
      card.className = "comment-item";

      const avatar = document.createElement("div");
      avatar.className = "comment-avatar";
      avatar.textContent = (data.name || "?").charAt(0).toUpperCase();

      const body = document.createElement("div");
      body.className = "comment-body";

      const meta = document.createElement("div");
      meta.className = "comment-meta";

      const name = document.createElement("strong");
      name.textContent = data.name || "Pengunjung";

      const date = document.createElement("span");
      date.className = "comment-date";
      date.textContent = displayDate(data.createdAt);

      const message = document.createElement("p");
      message.className = "comment-text";
      message.textContent = data.message || "";

      meta.append(name, date);
      body.append(meta, message);
      card.append(avatar, body);
      list.append(card);
    });
  }

  onSnapshot(
    query(commentsRef, orderBy("createdAt", "desc"), limit(100)),
    showComments,
    (error) => {
      console.error(error);
      showStatus(
        "Komentar belum bisa dimuat. Periksa konfigurasi dan Rules Firebase.",
        true
      );
    }
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
      showStatus("Nama dan komentar wajib diisi.", true);
      return;
    }

    if (name.length > 60 || message.length > 1000) {
      showStatus("Nama maksimal 60 dan komentar maksimal 1.000 karakter.", true);
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;

    showStatus("Mengirim komentar...");

    try {
      await addDoc(commentsRef, {
        name,
        message,
        createdAt: serverTimestamp()
      });

      form.reset();
      showStatus("Komentar berhasil dikirim. Terima kasih! 💙");
    } catch (error) {
      console.error(error);
      showStatus("Gagal mengirim komentar. Periksa Rules Firebase.", true);
    } finally {
      if (button) button.disabled = false;
    }
  });
}