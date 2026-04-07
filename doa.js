document.addEventListener("DOMContentLoaded", () => {
  const inputSearch = document.querySelector(".input-search");
  const cardList = document.querySelector(".card-list");
  const cardDoaList = document.querySelector(".card-doa-list");

  const endpoint = "https://equran.id/api/doa";
  let allDoa = [];

  function renderCards(data) {
    let cardDoa = "";

    data.forEach((doa) => {
      cardDoa += `
        <div class="col-lg-12 col-md-12 col-sm-12">
          <div class="card mb-4 card-doa">
            <div class="card-body" onclick="location.href='doadetail.html?nomordoa=${doa.id}'">
              <p class="card-title fw-semibold mb-0 lh-lg">${doa.id}. ${doa.nama}</p>
              <small class="text-muted">${doa.grup}</small>
            </div>
          </div>
        </div>
      `;
    });

    cardDoaList.innerHTML = cardDoa;
  }

  function renderSearchList(data) {
    if (!data.length) {
      cardList.innerHTML = `
        <div class="list-group-item text-muted">
          Tidak ada doa yang ditemukan.
        </div>
      `;
      return;
    }

    let listDoa = "";

    data.forEach((doa) => {
      listDoa += `
        <a href="#" data-iddoa="${doa.id}" class="list-group-item list-group-item-action">
          ${doa.nama}
        </a>
      `;
    });

    cardList.innerHTML = listDoa;
  }

  function filterDoa(query) {
    const filtered = allDoa.filter((doa) => {
      const nama = doa.nama?.toLowerCase() || "";
      const grup = doa.grup?.toLowerCase() || "";
      const tag = Array.isArray(doa.tag) ? doa.tag.join(" ").toLowerCase() : "";

      return (
        nama.includes(query) || grup.includes(query) || tag.includes(query)
      );
    });

    renderSearchList(filtered);
  }

  fetch(endpoint)
    .then((res) => res.json())
    .then((hasil) => {
      allDoa = hasil.data || [];

      renderCards(allDoa);
    })
    .catch((error) => {
      console.error("Gagal mengambil data doa:", error);
      cardDoaList.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">
            Gagal mengambil data doa.
          </div>
        </div>
      `;
    });

  inputSearch.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();

    if (query.length > 0) {
      cardList.classList.remove("hidden-list");
      filterDoa(query);
    } else {
      cardList.classList.add("hidden-list");
      cardList.innerHTML = "";
    }
  });

  cardList.addEventListener("click", function (e) {
    const item = e.target.closest("[data-iddoa]");
    if (!item) return;

    e.preventDefault();
    const idDoa = item.dataset.iddoa;
    window.location.href = `doadetail.html?nomordoa=${idDoa}`;
  });
});
