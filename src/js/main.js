import WOW from "wow.js";
new WOW().init();

import Swal from "sweetalert2";

// Export Swal to global scope for use in HTML scripts
window.Swal = Swal;

import "./components/slider";
import "./components/tmp-toggle";
import "./components/hover-effect";
import "./components/tabs";
import "./components/PopupManager";
import "./components/button";
import "./components/popup";
import "./components/faq-accordion";
import "./components/toast";
