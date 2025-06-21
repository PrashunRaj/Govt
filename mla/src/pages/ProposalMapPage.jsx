import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import {
  FunnelIcon,
  MapPinIcon,
  EyeIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  UserIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom component to handle map updates
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const MLAHeatmap = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [mlaProfile, setMlaProfile] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showLegend, setShowLegend] = useState(true);
  const [showDensityCircles, setShowDensityCircles] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center coordinates
  const [mapZoom, setMapZoom] = useState(5);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user) {
      getMLAProfile();
    }
  }, [user]);

  useEffect(() => {
    if (mlaProfile) {
      fetchProposals();
    }
  }, [filter, categoryFilter, mlaProfile]);

  const getMLAProfile = async () => {
    try {
      const cached = localStorage.getItem('mlaProfile');
      if (cached) {
        const profile = JSON.parse(cached);
        if (profile.clerkId === user.id && profile.profileCompleted) {
          setMlaProfile(profile);
          return;
        }
      }

      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/mla/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const profile = response.data.data;
        setMlaProfile(profile);
        localStorage.setItem('mlaProfile', JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Error getting MLA profile:', error);
    }
  };

  const fetchProposals = async () => {
    try {
      setLoading(true);
      
      const token = await getToken();
      const params = new URLSearchParams({
        limit: 500 // Get more proposals for comprehensive map view
      });

      if (filter !== 'all') params.append('status', filter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);

      const response = await axios.get(`${backendUrl}/api/mla/heatmap-proposals?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter proposals that have valid coordinates
        const proposalsWithValidCoords = response.data.data.proposals.filter(proposal => 
          proposal.coordinates && 
          proposal.coordinates.latitude && 
          proposal.coordinates.longitude &&
          !isNaN(proposal.coordinates.latitude) &&
          !isNaN(proposal.coordinates.longitude)
        ).map(proposal => ({
          ...proposal,
          coordinates: [
            parseFloat(proposal.coordinates.latitude), 
            parseFloat(proposal.coordinates.longitude)
          ]
        }));
        
        setProposals(proposalsWithValidCoords);
        
        // ✅ UPDATED: Auto-center map based on proposals only
        if (proposalsWithValidCoords.length > 0) {
          centerMapOnProposals(proposalsWithValidCoords);
        }
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Center map based on proposal distribution
  const centerMapOnProposals = (proposalList) => {
    if (proposalList.length === 0) return;
    
    const latitudes = proposalList.map(p => p.coordinates[0]);
    const longitudes = proposalList.map(p => p.coordinates[1]);
    
    const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
    
    setMapCenter([centerLat, centerLng]);
    setMapZoom(8);
  };

  // Process data to get proposal density by geographic clusters
  const processGeographicClusters = () => {
    const clusters = [];
    const clusterRadius = 0.5; // Degrees for clustering nearby proposals
    
    proposals.forEach(proposal => {
      let addedToCluster = false;
      
      // Check if proposal fits into existing cluster
      for (let cluster of clusters) {
        const distance = calculateDistance(
          proposal.coordinates[0], proposal.coordinates[1],
          cluster.centerLat, cluster.centerLng
        );
        
        if (distance <= clusterRadius) {
          cluster.proposals.push(proposal);
          cluster.count += 1;
          cluster.totalBudget += proposal.budget || 0;
          cluster.totalVotes += proposal.votes || 0;
          
          // Recalculate cluster center
          const lats = cluster.proposals.map(p => p.coordinates[0]);
          const lngs = cluster.proposals.map(p => p.coordinates[1]);
          cluster.centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
          cluster.centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
          
          addedToCluster = true;
          break;
        }
      }
      
      // Create new cluster if proposal doesn't fit existing ones
      if (!addedToCluster) {
        clusters.push({
          centerLat: proposal.coordinates[0],
          centerLng: proposal.coordinates[1],
          count: 1,
          proposals: [proposal],
          totalBudget: proposal.budget || 0,
          totalVotes: proposal.votes || 0,
          density: 'low'
        });
      }
    });
    
    // Determine density levels
    clusters.forEach(cluster => {
      if (cluster.count >= 10) cluster.density = 'high';
      else if (cluster.count >= 5) cluster.density = 'medium';
      else cluster.density = 'low';
    });
    
    return clusters;
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const geographicClusters = processGeographicClusters();

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#dc2626';
      case 'pending': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'completed': return '#8b5cf6';
      default: return '#6b7280';
    }
  };
  const formatBudget = (totalBudget) => {
  if (totalBudget >= 10000000) { // 1 Crore or more
    return `₹${(totalBudget / 10000000).toFixed(1)}Cr`;
  } else if (totalBudget >= 100000) { // 1 Lakh or more
    return `₹${(totalBudget / 100000).toFixed(1)}L`;
  } else if (totalBudget >= 1000) { // 1 Thousand or more
    return `₹${(totalBudget / 1000).toFixed(1)}K`;
  } else {
    return `₹${totalBudget.toLocaleString()}`; // Less than 1000, show full amount
  }
};

  const getDensityColor = (density) => {
    switch (density) {
      case 'high': return '#dc2626'; // Red
      case 'medium': return '#f59e0b'; // Yellow
      case 'low': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  const createCustomIcon = (proposal) => {
    const color = getStatusColor(proposal.status);
    const size = proposal.priority === 'high' ? 25 : proposal.priority === 'medium' ? 20 : 15;
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color}; 
          width: ${size}px; 
          height: ${size}px; 
          border-radius: 50%; 
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
          font-weight: bold;
        ">
          ${proposal.priority === 'high' ? '!' : proposal.priority === 'medium' ? '•' : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  const filteredProposals = proposals.filter(proposal => {
    if (filter !== 'all' && proposal.status !== filter) return false;
    if (categoryFilter !== 'all' && proposal.category !== categoryFilter) return false;
    if (searchQuery && !proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !proposal.constituency.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = [...new Set(proposals.map(p => p.category).filter(Boolean))];

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      centerMapOnProposals(proposals);
      return;
    }

    const matchingProposals = proposals.filter(proposal =>
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.constituency.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchingProposals.length > 0) {
      if (matchingProposals.length === 1) {
        setMapCenter(matchingProposals[0].coordinates);
        setMapZoom(12);
        setSelectedProposal(matchingProposals[0]);
      } else {
        centerMapOnProposals(matchingProposals);
      }
    }
  };

  // ✅ UPDATED: Focus on MLA area without coordinates
  const focusOnMLAArea = () => {
    if (!mlaProfile) return;
    
    const mlaAreaProposals = proposals.filter(p => 
      p.constituency === mlaProfile.constituency ||
      p.district === mlaProfile.district ||
      p.state === mlaProfile.state
    );
    
    if (mlaAreaProposals.length > 0) {
      centerMapOnProposals(mlaAreaProposals);
    } else {
      // ✅ FALLBACK: Center on India if no proposals in MLA area
      setMapCenter([20.5937, 78.9629]); // India center
      setMapZoom(5);
    }
  };

  if (!mlaProfile || !mlaProfile.profileCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Required</h2>
          <p className="text-gray-600">Please complete your MLA profile to view the proposal heatmap.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MLA Proposal Heatmap</h1>
          <p className="text-gray-600 mt-1">
            Interactive map showing {proposals.length} proposals across your jurisdiction and beyond
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDensityCircles(!showDensityCircles)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              showDensityCircles 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span>Density</span>
          </button>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <InformationCircleIcon className="h-5 w-5" />
            <span>{showLegend ? 'Hide' : 'Show'} Legend</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="flex items-center space-x-2 min-w-0">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-w-0"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 min-w-0">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full min-w-0"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 min-w-0">
            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full min-w-0"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Focus on MLA Area */}
          <div className="flex items-center space-x-2 min-w-0">
            <button
              onClick={focusOnMLAArea}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors w-full"
            >
              My Constituency
            </button>
          </div>

          {/* Reset View */}
          <div className="flex items-center space-x-2 min-w-0">
            <button
              onClick={() => {
                centerMapOnProposals(proposals);
                setSelectedProposal(null);
                setSearchQuery('');
              }}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors w-full"
            >
              Reset View
            </button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 flex items-center min-w-0">
            Showing {filteredProposals.length} of {proposals.length} proposals
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div style={{ height: '600px', width: '100%', position: 'relative' }}>
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <MapUpdater center={mapCenter} zoom={mapZoom} />
                
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Geographic Density Circles */}
                {showDensityCircles && geographicClusters.map((cluster, index) => (
                  <Circle
                    key={`cluster-${index}`}
                    center={[cluster.centerLat, cluster.centerLng]}
                    radius={cluster.count * 1000} // Radius based on proposal count
                    pathOptions={{
                      color: getDensityColor(cluster.density),
                      fillColor: getDensityColor(cluster.density),
                      fillOpacity: 0.2,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-gray-900">Cluster Area</h3>
                        <p className="text-sm text-gray-600">{cluster.count} proposal(s)</p>
                        <p className="text-sm text-gray-600">
                          Total Budget: ₹{(cluster.totalBudget / 100000).toFixed(1)}L
                        </p>
                        <p className="text-sm text-gray-600">Total Votes: {cluster.totalVotes}</p>
                        <p className="text-sm text-gray-600">
                          Coordinates: {cluster.centerLat.toFixed(4)}, {cluster.centerLng.toFixed(4)}
                        </p>
                      </div>
                    </Popup>
                  </Circle>
                ))}
                
                {/* Individual Proposal Markers */}
                {filteredProposals.map((proposal) => (
                  <Marker
                    key={proposal._id}
                    position={proposal.coordinates}
                    icon={createCustomIcon(proposal)}
                    eventHandlers={{
                      click: () => setSelectedProposal(proposal)
                    }}
                  >
                    <Popup>
                      <div className="p-3 max-w-sm">
                        <h3 className="font-semibold text-gray-900 mb-2">{proposal.title}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Location:</strong> {proposal.constituency}, {proposal.district}</p>
                          <p><strong>Coordinates:</strong> {proposal.coordinates[0].toFixed(4)}, {proposal.coordinates[1].toFixed(4)}</p>
                          <p><strong>Category:</strong> {proposal.category}</p>
                          <p><strong>Budget:</strong> ₹{((proposal.budget || 0) / 100000).toFixed(1)} Lakhs</p>
                          <p><strong>Votes:</strong> {proposal.votes || 0}</p>
                          <p><strong>Submitted by:</strong> {proposal.submittedBy}</p>
                          <p><strong>Date:</strong> {new Date(proposal.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{proposal.description}</p>
                        <div className="mt-2 flex space-x-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            proposal.status === 'approved' ? 'text-green-600 bg-green-100' :
                            proposal.status === 'rejected' ? 'text-red-600 bg-red-100' :
                            proposal.status === 'in_progress' ? 'text-blue-600 bg-blue-100' :
                            proposal.status === 'completed' ? 'text-purple-600 bg-purple-100' :
                            'text-yellow-600 bg-yellow-100'
                          }`}>
                            {proposal.status.replace('_', ' ').toUpperCase()}
                          </span>
                          {proposal.priority && (
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              proposal.priority === 'high' ? 'text-red-600 bg-red-100' :
                              proposal.priority === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                              'text-green-600 bg-green-100'
                            }`}>
                              {proposal.priority.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Legend */}
              {showLegend && (
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-[1000]">
                  <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Proposal Status</h4>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <span className="text-xs text-gray-600">Approved</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-gray-600">In Progress</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                          <span className="text-xs text-gray-600">Completed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                          <span className="text-xs text-gray-600">Pending</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-red-500"></div>
                          <span className="text-xs text-gray-600">Rejected</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Priority Level</h4>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">!</div>
                          <span className="text-xs text-gray-600">High Priority (Large)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">•</div>
                          <span className="text-xs text-gray-600">Medium Priority</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                          <span className="text-xs text-gray-600">Low Priority (Small)</span>
                        </div>
                      </div>
                    </div>

                    {showDensityCircles && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Geographic Density</h4>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-red-500 opacity-30"></div>
                            <span className="text-xs text-gray-600">High (10+ proposals)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-30"></div>
                            <span className="text-xs text-gray-600">Medium (5-9 proposals)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-green-500 opacity-30"></div>
                            <span className="text-xs text-gray-600">Low (1-4 proposals)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* ✅ UPDATED: MLA Area Info without coordinates */}
          {mlaProfile && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Constituency</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Constituency:</strong> {mlaProfile.constituency}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>District:</strong> {mlaProfile.district}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>State:</strong> {mlaProfile.state}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Party:</strong> {mlaProfile.politicalParty}
                </p>
              </div>
              <button
                onClick={focusOnMLAArea}
                className="w-full mt-3 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Focus on My Area
              </button>
            </div>
          )}

          {/* Real-time Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Proposals</span>
                <span className="font-semibold text-gray-900">{proposals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">With Coordinates</span>
                <span className="font-semibold text-green-600">{proposals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Geographic Clusters</span>
                <span className="font-semibold text-blue-600">{geographicClusters.length}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {proposals.filter(p => p.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved</span>
                  <span className="font-semibold text-green-600">
                    {proposals.filter(p => p.status === 'approved').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">
                    {proposals.filter(p => p.status === 'in_progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-purple-600">
                    {proposals.filter(p => p.status === 'completed').length}
                  </span>
                </div>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
  <span className="text-gray-600">Total Budget</span>
  <span className="font-semibold text-gray-900">
    {formatBudget(proposals.reduce((sum, p) => sum + (p.budget || 0), 0))}
  </span>
</div>
              </div>
            </div>
          </div>

          {/* Selected Proposal Details */}
          {selectedProposal && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Proposal</h3>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">{selectedProposal.title}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Location:</strong> {selectedProposal.constituency}, {selectedProposal.district}</p>
                  <p><strong>Coordinates:</strong> {selectedProposal.coordinates[0].toFixed(4)}, {selectedProposal.coordinates[1].toFixed(4)}</p>
                  <p><strong>Category:</strong> {selectedProposal.category}</p>
                  <p><strong>Budget:</strong> ₹{((selectedProposal.budget || 0) / 100000).toFixed(1)} Lakhs</p>
                  <p><strong>Votes:</strong> {selectedProposal.votes || 0}</p>
                  <p><strong>Submitted by:</strong> {selectedProposal.submittedBy}</p>
                  <p><strong>Date:</strong> {new Date(selectedProposal.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{selectedProposal.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProposal.status === 'approved' ? 'text-green-600 bg-green-100' :
                    selectedProposal.status === 'rejected' ? 'text-red-600 bg-red-100' :
                    selectedProposal.status === 'in_progress' ? 'text-blue-600 bg-blue-100' :
                    selectedProposal.status === 'completed' ? 'text-purple-600 bg-purple-100' :
                    'text-yellow-600 bg-yellow-100'
                  }`}>
                    {selectedProposal.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {selectedProposal.priority && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedProposal.priority === 'high' ? 'text-red-600 bg-red-100' :
                      selectedProposal.priority === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                      'text-green-600 bg-green-100'
                    }`}>
                      {selectedProposal.priority.toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="w-full mt-3 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close Details
                </button>
              </div>
            </div>
          )}

          {/* Top Geographic Clusters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clusters</h3>
            <div className="space-y-3">
              {geographicClusters
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((cluster, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => {
                      setMapCenter([cluster.centerLat, cluster.centerLng]);
                      setMapZoom(10);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getDensityColor(cluster.density) }}
                      ></div>
                      <span className="text-sm text-gray-900">
                        Cluster {index + 1}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {cluster.count} proposal{cluster.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
            <div className="space-y-2">
              {categories.map(category => {
                const count = proposals.filter(p => p.category === category).length;
                const percentage = proposals.length > 0 ? (count / proposals.length * 100).toFixed(1) : 0;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                      <span className="text-xs text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLAHeatmap;
