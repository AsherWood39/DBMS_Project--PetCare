let currentRequestId = null;

// Open modal and store which adoption ID is being rejected
function openRejectModal(requestId) {
  currentRequestId = requestId;
  document.getElementById("rejectModal").style.display = "flex";
}

// Close modal
function closeRejectModal() {
  document.getElementById("rejectModal").style.display = "none";
  document.getElementById("customReason").value = ""; // clear custom reason
  document.getElementById("rejectionReason").value = "Incomplete health records"; // reset dropdown
  document.getElementById("customReason").style.display = "none"; // hide textarea
}

// Show textarea if "Other" is selected
document.getElementById("rejectionReason").addEventListener("change", function() {
  let customReasonField = document.getElementById("customReason");
  if (this.value === "Other") {
    customReasonField.style.display = "block";
  } else {
    customReasonField.style.display = "none";
  }
});

// Submit rejection reason
function submitRejection() {
  let reason = document.getElementById("rejectionReason").value;

  if (reason === "Other") {
    reason = document.getElementById("customReason").value.trim();
  }

  if (!reason) {
    alert("Please provide a rejection reason.");
    return;
  }

  // ✅ Update table UI
  let reasonCell = document.getElementById(`reason-${currentRequestId}`);
  if (reasonCell) {
    reasonCell.textContent = reason;
  }

  // ✅ Update status in UI
  let row = reasonCell.closest("tr");
  let statusCell = row.querySelector("td:nth-child(5)");
  statusCell.textContent = "Rejected";
  statusCell.className = "status-rejected";

  // ✅ (Later) Send to backend
  console.log("Rejected Request:", currentRequestId, "Reason:", reason);
  /*
  fetch('/rejectRequest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: currentRequestId, reason: reason })
  });
  */

  // Close modal
  closeRejectModal();
}
