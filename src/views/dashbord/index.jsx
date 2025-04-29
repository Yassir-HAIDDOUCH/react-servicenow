import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { UserOutlined, TeamOutlined, AppstoreOutlined, TagsOutlined, ProfileOutlined } from '@ant-design/icons'; // Import relevant icons
import { getall as getSpecs } from '../../features/servicenow/product-specification/productSpecificationSlice';
import { getall as getCats } from '../../features/servicenow/product-offering/productOfferingCategorySlice';
import { getall as getPOs } from '../../features/servicenow/product-offering/productOfferingSlice';
import { useDispatch, useSelector } from 'react-redux';
// --- Mock Data Fetching Function ---
// Replace this with your actual data fetching logic (e.g., API calls)
const fetchDashboardData = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
  
    // Return mock data
    return {
      users: 1250,
      clients: 350,
      productOfferings: 85,
      productCategories: 15,
      productSpecifications: 42,
    };
  };


// --- Dashboard Component ---
const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
      // Selectors
      const { data: specs, loading: specsLoading, error: specsError } = useSelector(
        (state) => state.productSpecification
      );
      const { data: cats, loading: catsLoading, error: catsError } = useSelector(
        (state) => state.productOfferingCategory
      );
      const { data: pos, loading: posLoading, error: posError } =
        useSelector((state) => state.productOffering);
      useEffect(() => {
          if (localStorage.getItem('access_token')) {
            dispatch(getSpecs());
            dispatch(getCats({ page: 1, limit: 6 }));
            dispatch(getPOs({ page: 1, limit: 6 }));
          } else {
            console.error('Auth token not found. Please login.');
          }
        }, [dispatch]);
  
    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          setError(null);
          const fetchedData = {
            users: 1250,
            clients: 350,
            productOfferings: pos?.length || "N/A",
            productCategories: cats?.length || "N/A",
            productSpecifications: specs?.length || "N/A",
          };
          setData(fetchedData);
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
          setError("Failed to load dashboard data.");
          setData({ // Provide default zero values on error
              users: 0,
              clients: 0,
              productOfferings: 0,
              productCategories: 0,
              productSpecifications: 0,
          });
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, []); // Empty dependency array means this runs once on mount
    
    return (
      // Use Tailwind classes for padding and background
      <div className="p-6 bg-gray-100 h-svh"> {/* Changed from inline style */}
        {/* Use Tailwind class for error text color */}
        {error && <p className="text-red-600 mb-4">{error}</p>} {/* Changed from inline style, added margin */}
        <Spin spinning={catsLoading} size="large">
          {/* Use Ant Design Grid system for responsiveness */}
          <Row gutter={[16, 16]}>
            {/* Users Card */}
            <Col xs={24} sm={12} md={8} lg={8} xl={4}> {/* Adjust span for different screen sizes */}
              {/* Card styling is handled by Ant Design, hoverable adds effect */}
              <Card  hoverable>
                <Statistic
                  title="Total Users"
                  value={data?.users ?? 0} // Use nullish coalescing for default value
                  prefix={<UserOutlined />}
                  // Keep valueStyle for specific antd component styling
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
  
            {/* Clients Card */}
            <Col xs={24} sm={12} md={8} lg={8} xl={4}>
              <Card  hoverable>
                <Statistic
                  title="Total Clients"
                  value={data?.clients ?? 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1890ff' }} // Keep valueStyle
                />
              </Card>
            </Col>
  
            {/* Product Offerings Card */}
            <Col xs={24} sm={12} md={8} lg={8} xl={4}>
              <Card  hoverable>
                <Statistic
                  title="Product Offerings"
                  value={data?.productOfferings ?? 0}
                  prefix={<AppstoreOutlined />}
                  valueStyle={{ color: '#cf1322' }} // Keep valueStyle
                />
              </Card>
            </Col>
  
            {/* Product Categories Card */}
            <Col xs={24} sm={12} md={12} lg={6} xl={4}> {/* Adjusted spans for 5 items */}
              <Card  hoverable>
                <Statistic
                  title="Product Categories"
                  value={data?.productCategories ?? 0}
                  prefix={<TagsOutlined />}
                  valueStyle={{ color: '#faad14' }} // Keep valueStyle
                />
              </Card>
            </Col>
  
            {/* Product Specifications Card */}
            <Col xs={24} sm={24} md={12} lg={6} xl={6}> {/* Adjusted spans for 5 items */}
              <Card hoverable>
                <Statistic
                  title="Product Specifications"
                  value={data?.productSpecifications ?? 0}
                  prefix={<ProfileOutlined />}
                  valueStyle={{ color: '#722ed1' }} // Keep valueStyle
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  };

export default Dashboard;