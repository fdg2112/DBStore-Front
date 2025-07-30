import Header from "../Header/Header"
import Footer from "../Footer/Footer"

const Layout = (props) => {
  return (
    <>
    <div className="layout">
      <Header />
      <main className="layout-content">
        {props.children}
      </main>
      <Footer />
    </div>
    </>
  )
}

export default Layout;