$(document).ready(function() {
  $("#webScrape").on("click", async function() {
    try {
      await $.ajax({
        type: "GET",
        url: "/scrape"
      });
      window.location = "/scrape";
    } catch (error) {
      console.log(error);
    }
  });

  $("#dropData").on("click", async () => {
    try {
      await $.ajax({
        type: "DELETE",
        url: "dropdata"
      }).then(location.reload());
    } catch (error) {
      console.error(error);
    }
  });

  $(".delPost").on("click", async function() {
    let id = $(this).data("id");

    try {
      await $.ajax({
        type: "DELETE",
        url: "/jobs/" + id
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  });
});
