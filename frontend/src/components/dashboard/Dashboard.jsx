import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const { token } = useAuth();

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

  const fetchRepositories = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/repo/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setRepositories(data.repositories || []);
    } catch (err) {
      console.error("Error fetching user repositories:", err);
    }
  };

  const fetchSuggestedRepositories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/repo/all`);
      const data = await response.json();
      setSuggestedRepositories(data || []);
    } catch (err) {
      console.error("Error fetching suggested repositories:", err);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchRepositories(userId);
      fetchSuggestedRepositories();
    }
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  useEffect(() => {
    console.log("Suggested Repositories:", suggestedRepositories);
  }, [suggestedRepositories]);

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.map((repo) => (
            <div key={repo._id} className="repo-card">
              <h4>{repo.name}</h4>
              <p>{repo.description || "No description available."}</p>
            </div>
          ))}
        </aside>

        <main>
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchResults.length === 0 ? (
            <p>No matching repositories found.</p>
          ) : (
            searchResults.map((repo) => (
              <div key={repo._id} className="repo-card">
                <h4>{repo.name}</h4>
                <p>{repo.description || "No description available."}</p>
              </div>
            ))
          )}
        </main>

        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li><p>Tech Conference - July 15</p></li>
            <li><p>Developer Meetup - July 25</p></li>
            <li><p>React Summit - August 5</p></li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
