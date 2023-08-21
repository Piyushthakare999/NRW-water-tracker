import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

// Components
import CustomPieChart from "../Charts/CustomPieChart";
import CustomLineChart from "../Charts/CustomLineChart";
import CustomBarChart from "../Charts/CustomBarChart";

const Details = ({
  isSidebarOpen,
  isDetailsOpen,
  closeSideBar,
  showDetails,
  showSidebar,
  name,
  threshold,
  averagePerDay,
  currentConsumed,
  revenueMonthly,
  nonRevenueMonthly,
  keyId,
}) => {
  const data = [
    { name: name, value: revenueMonthly, title: "Revenue Water" },
    { name: name, value: nonRevenueMonthly, title: "Non Revenue Water" },
  ];

  return (
    <div
      className={`detail--popup ${isSidebarOpen ? "show-sidebar" : ""}
        ${isDetailsOpen ? "show-details" : ""}`}
    >
      {isSidebarOpen && (
        <div className="card detail-card">
          <header className="card-header">
            <p className="card-header-title">{name}</p>
            <button
              className="card-header-icon"
              aria-label="close"
              onClick={closeSideBar}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faClose} />
              </span>
            </button>
          </header>
          <div className="card-content">
            <div className="content">
              <CustomPieChart data={data} />
            </div>
            <div className="content">
              <p>
                Daily Threshold:{" "}
                <span className="has-text-weight-semibold">
                  {threshold} kLtrs
                </span>
              </p>
              <p>
                Daily Average Consumption:{" "}
                <span className="has-text-weight-semibold">
                  {averagePerDay} kLtrs
                </span>
              </p>
              <p>
                Today's Consumption:{" "}
                <span className="has-text-weight-semibold">
                  {currentConsumed} kLtrs
                </span>
              </p>
              <p>
                Revenue Water (Monthly):{" "}
                <span className="has-text-weight-semibold">
                  {revenueMonthly} kLtrs
                </span>
              </p>
              <p>
                Non Revenvue Water (Monthly):{" "}
                <span className="has-text-weight-semibold">
                  {nonRevenueMonthly} kLtrs
                </span>
              </p>
            </div>
          </div>
          <footer className="card-footer">
            <button onClick={showDetails} className="button card-footer-item">
              Detailed Analysis
            </button>
          </footer>
        </div>
      )}
      {isDetailsOpen && (
        <div className="card detail-card">
          <header className="card-header">
            <p className="card-header-title">{name}</p>
            <button
              className="card-header-icon"
              aria-label="close"
              onClick={closeSideBar}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faClose} />
              </span>
            </button>
          </header>
          <div className="card-content details-background">
            <div className="tile is-ancestor">
              <div className="tile is-parent is-7">
                <article className="tile is-child box">
                  <p className="title">Monthly Analysis</p>
                  <p className="subtitle has-text-grey is-size-6">
                    Monthly Non Revenue Water (NRW) Analysis Report
                  </p>
                  <div className="content">
                    <CustomLineChart />
                  </div>
                </article>
              </div>
              <div className="tile is-parent">
                <article className="tile is-child box">
                  <p className="title">Water Revenue Details</p>
                  <div className="content">
                    <CustomPieChart data={data} />
                  </div>
                </article>
              </div>
            </div>
            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <article className="tile is-child box">
                  <p className="title">Details</p>
                  <div className="content">
                    <p>
                      Daily Threshold:{" "}
                      <span className="has-text-weight-semibold">
                        {threshold} Ltrs
                      </span>
                    </p>
                    <p>
                      Daily Average Consumption:{" "}
                      <span className="has-text-weight-semibold">
                        {averagePerDay} Ltrs
                      </span>
                    </p>
                    <p>
                      Today's Consumption:{" "}
                      <span className="has-text-weight-semibold">
                        {currentConsumed} Ltrs
                      </span>
                    </p>
                    <p>
                      Revenue Water (Monthly):{" "}
                      <span className="has-text-weight-semibold">
                        {revenueMonthly} Ltrs
                      </span>
                    </p>
                    <p>
                      Non Revenvue Water (Monthly):{" "}
                      <span className="has-text-weight-semibold">
                        {nonRevenueMonthly} Ltrs
                      </span>
                    </p>
                  </div>
                </article>
              </div>
              <div className="tile is-parent is-8">
                <article className="tile is-child box">
                  <p className="title">Distribution Analysis</p>
                  <p className="subtitle has-text-grey is-size-6">
                    Distributor-wise Water Revenue Analysis Report
                  </p>
                  <div className="content">
                    <CustomBarChart />
                  </div>
                </article>
              </div>
            </div>
          </div>
          <footer className="card-footer">
            <button
              onClick={() => showSidebar(keyId)}
              className="button card-footer-item"
            >
              Overview
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Details;
