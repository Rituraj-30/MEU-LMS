import SecondaryNavbar from "./SecondaryNavbar";
import LatestEventsBox from "./LatestEventsBox";
import MUPromise from "./MUPromise";
import MUAboutSection from "./MUAboutSection";
import MUSuccessSection from "./MUSuccessSection";
import Footer from "./Footer"; // Fixed the typo here (Footer. to Footer)

const Landingpage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Layer */}
      <SecondaryNavbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <section>
           <LatestEventsBox />
        </section>

        <section>
          <MUPromise />
        </section>

        <section>
          <MUAboutSection />
        </section>

        <section>
          <MUSuccessSection />
        </section>
      </main>

      {/* Footer Layer */}
      <Footer />
    </div>
  );
};

export default Landingpage;