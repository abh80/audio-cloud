export default function FilterBar() {
  return (
    <div
      id="filter-bar"
      className="p-2"
      style={{
        position: "absolute",
        bottom: "90px",
        right: "0",
        width: "400px",
        height: "150px",
        backgroundColor: "#151515",
        border: "1px solid rgb(40, 40, 40)",
        borderRadius: "15px",
        transition: "all .5s ease-in-out",
      }}
    >
      <div className="text-lg font-bold px-5">Filters</div>
      <div className="grid grid-flow-col p-2 px-6">
        <div>
          <div>Bass</div>
          <input
            id="bass-preset"
            type="number"
            pattern="[0-9]*"
            onInput={(e) => {
              if (e.currentTarget.value.length > 2) {
                e.currentTarget.value = e.currentTarget.value.slice(0, 2);
              }
              if (parseInt(e.currentTarget.value) > 50) {
                e.currentTarget.value = e.currentTarget.value.slice(0, -1);
                window.wrapper.showDialog(
                  "Please enter a number less than 50."
                );
              }
            }}
            className="filter-input"
            style={{ width: "50px" }}
          />
        </div>
        <div>
          <div>Sample Rate</div>
          <input
            id="sample-rate-preset"
            type="number"
            className="filter-input"
            style={{ width: "100px" }}
          />
        </div>
      </div>
      <div
        className="absolute text-center font-bold"
        style={{
          bottom: "5px",
          width: "80px",
          height: "30px",
          borderRadius: "15px",
          backgroundColor: "#ff5500",
          right: "10px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#ff3300";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#ff5500";
        }}
        onClick={(e) => {
          let p = document.getElementById("bass-preset").value;
          let r = document.getElementById("sample-rate-preset").value;
          if (isNaN(p) || isNaN(r)) {
            window.wrapper.showDialog("Please enter a number.");
            return;
          }

          if (!p || !r) {
            window.wrapper.showDialog("Please enter a real number");
            return;
          }
          if (parseInt(r) < 40000 || parseInt(r) > 62000) {
            window.wrapper.showDialog(
              "Please enter Sample Rate between 40000 and 62000."
            );
            return;
          }
          if (parseInt(p) < 0) {
            window.wrapper.showDialog(
              "Please enter bass greater than or equal to 0."
            );
            return;
          }

          if (parseInt(p) > 50) {
            window.wrapper.showDialog("Please enter bass less than 50.");
            return;
          }
          window.wrapper.setPresets({ bass: p, rate: r });
        }}
      >
        Apply
      </div>
      <div
        className="absolute"
        style={{
          bottom: "10px",
          width: "20px",
          height: "20px",
          left: "10px",
          cursor: "pointer",
          transform: "rotate(179deg)",
          transition: "all .5s ease-in-out",
        }}
        onClick={(e) => {
          if (document.getElementById("filter-bar").style.right === "0px") {
            document.getElementById("filter-bar").style.right = "-370px";
            e.currentTarget.style.transform = "rotate(0deg)";
          } else {
            document.getElementById("filter-bar").style.right = "0px";
            e.currentTarget.style.transform = "rotate(179deg)";
          }
        }}
      >
        <svg fill="white" height="20" role="img" width="24" viewBox="0 0 20 20">
          <polygon points="15.54,21.151 5.095,12.229 15.54,3.309 16.19,4.069 6.635,12.229 16.19,20.39 "></polygon>
        </svg>
      </div>
    </div>
  );
}
