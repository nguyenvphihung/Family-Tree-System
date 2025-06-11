import React, { useEffect, useState } from "react";

function TestPersonPage() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/person")
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu từ backend");
        return res.json();
      })
      .then((data) => {
        setPeople(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      <h2>Danh sách Person (Test)</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
          </tr>
        </thead>
        <tbody>
          {people.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.full_name || p.name}</td>
              <td>{p.birth_date}</td>
              <td>{p.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TestPersonPage;