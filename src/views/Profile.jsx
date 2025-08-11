import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../styles/Profile.css";
import { UserContext } from "../context/UserContext";
import { getUserById, updateUser, changePassword } from "../services/userService";

const Profile = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  const userId = userData?.id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    number: "",
    apartment: "",
    city: "",
    province: "",
    country: "",
    postalCode: ""
  });

  const [pwd, setPwd] = useState({
    currentPassword: "",
    newPassword: "",
    newPassword2: ""
  });

  const canSave = useMemo(() => form.email.trim() !== "" && !saving, [form.email, saving]);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const u = await getUserById(userId);
        setForm({
          firstName: u.firstName ?? u.nombre ?? "",
          lastName: u.lastName ?? u.apellido ?? "",
          phone: u.phone ?? u.telefono ?? "",
          email: u.email ?? "",
          address: u.address ?? u.direccion ?? "",
          number: (u.number ?? u.numero ?? "") + "",
          apartment: u.apartment ?? u.departamento ?? "",
          city: u.city ?? u.ciudad ?? "",
          province: u.province ?? u.provincia ?? "",
          country: u.country ?? u.pais ?? "",
          postalCode: u.postalCode ?? u.codigoPostal ?? ""
        });
      } catch {
        setError("No se pudieron cargar tus datos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        number: form.number,
        apartment: form.apartment,
        city: form.city,
        province: form.province,
        country: form.country,
        postalCode: form.postalCode
      };
      const updated = await updateUser(userId, payload);
      setSuccess("Datos actualizados");
      setUserData({
        ...(userData || {}),
        email: updated.email ?? payload.email,
        roles: userData?.roles || [],
        id: userId
      });
    } catch {
      setError("No se pudieron guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");
    if (!pwd.currentPassword || !pwd.newPassword || !pwd.newPassword2) {
      setPwdError("Completá todos los campos");
      return;
    }
    if (pwd.newPassword !== pwd.newPassword2) {
      setPwdError("Las contraseñas no coinciden");
      return;
    }
    setPwdSaving(true);
    try {
      await changePassword(userId, {
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword
      });
      setPwdSuccess("Contraseña actualizada");
      setPwd({ currentPassword: "", newPassword: "", newPassword2: "" });
    } catch {
      setPwdError("No se pudo actualizar la contraseña");
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <Layout>
      <section className="profile">
        <div className="profile-wrap">
          <h1 className="profile-title">Mi Perfil</h1>

          {loading && <div className="profile-loading">Cargando…</div>}
          {!loading && (
            <>
              {error && <div className="profile-alert error">{error}</div>}
              {success && <div className="profile-alert success">{success}</div>}

              <form className="profile-card" onSubmit={handleSave}>
                <div className="profile-grid">
                  <div className="field">
                    <label>Nombre</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Apellido</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Teléfono</label>
                    <input name="phone" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>E-mail</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} />
                  </div>
                  <div className="field span2">
                    <label>Dirección</label>
                    <input name="address" value={form.address} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Número</label>
                    <input name="number" value={form.number} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Departamento</label>
                    <input name="apartment" value={form.apartment} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Ciudad</label>
                    <input name="city" value={form.city} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Provincia</label>
                    <input name="province" value={form.province} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>País</label>
                    <input name="country" value={form.country} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Código Postal</label>
                    <input name="postalCode" value={form.postalCode} onChange={handleChange} />
                  </div>
                </div>

                <div className="profile-actions">
                  <button type="submit" className="btn-save" disabled={!canSave}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>

              <div className="profile-subtitle">Cambiar contraseña</div>
              {pwdError && <div className="profile-alert error">{pwdError}</div>}
              {pwdSuccess && <div className="profile-alert success">{pwdSuccess}</div>}

              <form className="profile-card profile-password" onSubmit={handlePwdSubmit}>
                <div className="profile-grid pwd">
                  <div className="field">
                    <label>Contraseña actual</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={pwd.currentPassword}
                      onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Nueva contraseña</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={pwd.newPassword}
                      onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Repetir nueva contraseña</label>
                    <input
                      type="password"
                      name="newPassword2"
                      value={pwd.newPassword2}
                      onChange={(e) => setPwd({ ...pwd, newPassword2: e.target.value })}
                    />
                  </div>
                </div>

                <div className="profile-actions">
                  <button type="submit" className="btn-save" disabled={pwdSaving}>
                    {pwdSaving ? "Guardando..." : "Actualizar contraseña"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
