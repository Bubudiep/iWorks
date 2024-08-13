class Iw {
  async get(url) {
      try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Network response was not ok');
          const result = await response.json();
          return result;
      } catch (err) {
          console.error(err.message);
          throw err;
      }
  }

  async post(url, body) {
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
          });
          if (!response.ok) throw new Error('Network response was not ok');
          const result = await response.json();
          return result;
      } catch (err) {
          console.error(err.message);
          throw err;
      }
  }

  async patch(url, body) {
      try {
          const response = await fetch(url, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
          });
          if (!response.ok) throw new Error('Network response was not ok');
          const result = await response.json();
          return result;
      } catch (err) {
          console.error(err.message);
          throw err;
      }
  }

  async delete(url) {
      try {
          const response = await fetch(url, {
              method: 'DELETE',
          });
          if (!response.ok) throw new Error('Network response was not ok');
          const result = await response.json();
          return result;
      } catch (err) {
          console.error(err.message);
          throw err;
      }
  }
}