export const SITE = "iste-easwari-student-chapter-melx.vercel.app";
export const DIRECTORS = ["Rehan J", "Nithiya Shree S", "Rohith J P", "Gurudharshan S", "Divya Dharshini K", "Harshana B"];
// [name, position, face file (public/faces) or null]
export const THIRD = [
  ["Dhayas Sri R", "President", "dhayas"], ["Pooja Sree J R", "Secretary · Head of Operations", "pooja"], ["Nallathai K", "Treasurer", "nallathai"],
  ["Thilagan M R", "Public Relations Chairman", "thilagan"], ["Varun A K", "Digital Content Head", "varun"],
  ["Tharun Kumar M", "Digital Design Head", "tharun"], ["Pradeepa S N", "Digital Head", "pradeepa"], ["Theepa Lakshmi S", "Content Head", "theepa"],
];
export const SECOND = [
  ["Nandhiga L", "Vice President", "nandhiga"], ["Mathiarasu J P", "Joint Secretary", "mathiarasu"], ["Sahitya Sastry", "Joint Treasurer", "sahitya"],
  ["Divya Dharshini K", "Technical Member", "divya"], ["Gurudharshan S", "Technical Member", "gurudharshan"], ["Harshana B", "Technical Member", "harshana"],
  ["Nithiya Shree S", "Technical Member", "nithiya"], ["Rohith J P", "Technical Member", "rohith"], ["Rehan J", "Technical Member", "rehan"],
  ["Bharathi S", "Content Member", "bharathi"], ["Rifqa Shajiaa R", "Content Member", "rifqa"], ["S Lekha", "Content Member", "lekha"],
  ["Anish Kumar S", "Digital Content Member", "anish"],
  ["Mohanapriyan B", "Digital Design Member", "mohanapriyan"], ["Sakthivel R", "Digital Design Member", "sakthivel"], ["Sushwanth Vaibhav S", "Digital Design Member", "sushwanth"], ["Tharaneish M J", "Digital Design Member", "tharaneish"],
  ["Ankitha Sagesh", "Digital Member", "ankitha"], ["Bala Roobana T", "Digital Member", "bala"], ["Harisaran", "Digital Member", "harisaran"], ["Sanjiv P", "Digital Member", "sanjiv"],
  ["Aaditya P", "Operations Member", "aaditya"], ["Abinaya K", "Operations Member", "abinaya"], ["Harshedha V", "Operations Member", "harshedha"], ["Lokesh P", "Operations Member", "lokesh"],
  ["M Dharshini", "Operations Member", "dharshini"], ["Priyavagulaa K", "Operations Member", "priyavagulaa"], ["Satindra R", "Operations Member", "satindra"],
  ["Elanithi I", "Membership & Development", "elanithi"], ["Jenani Elangovan", "Sponsorship Member", "jenani"], ["Karthikeyan", "Sponsorship Member", "karthikeyan"], ["Mohana Vidya A", "Membership & Development", "mohana"],
  ["Nithyassri Dhanaraj", "Sponsorship Member", "nithyassri"], ["Pavya Dharshini D", "Membership & Development", "pavya"], ["Shyamganesh A", "Public Relations Officer", "shyamganesh"], ["Tannishitha L G", "Public Relations Officer", "tannishitha"],
];
export const initials = n => n.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();

export const GROUPS = [
  ["Secondary Leadership", [0, 1, 2]], ["Technical Team", [3, 4, 5, 6, 7, 8]], ["Content Team", [9, 10, 11]], ["Digital Content Team", [12]],
  ["Digital Design Team", [13, 14, 15, 16]], ["Digital Team", [17, 18, 19, 20]], ["Operations Team", [21, 22, 23, 24, 25, 26, 27]],
  ["Public Relations Team", [28, 29, 30, 31, 32, 33, 34, 35]],
];
export const STORY_TEAMS = [
  ["Technical", "builds the code"], ["Content", "writes the story"], ["Digital Content", "shapes the feed"], ["Digital Design", "designs the look"],
  ["Digital", "runs the platform"], ["Operations", "makes it happen"], ["Public Relations", "opens every door"],
];

import LIVE from "./live.json";
const toP = ([name, role, f]) => ({ name, role, photo: f ? `/faces/${f}.jpg` : null });
const STATIC = { tenure: "2026-27", core: THIRD.map(toP), groups: GROUPS.map(([g, idx]) => [g, idx.map(i => toP(SECOND[i]))]) };
export const ROSTER = LIVE.core && LIVE.core.length ? LIVE : STATIC;
export const FACULTY = [["Faculty Coordinator", "Dr Subramani N"]];
