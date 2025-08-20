#!/usr/bin/env node
// Test script for KYC submission endpoint
import fs from 'fs'
import { randomUUID } from 'crypto'

const API_BASE = process.env.API_BASE || 'http://localhost:8787'

// Create a test image file for upload
const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
const testImageBuffer = Buffer.from(testImageData, 'base64')

console.log('Testing KYC submission endpoint...')

async function testKYCSubmission() {
  try {
    // First, get a token by logging in as admin
    console.log('1. Logging in as admin...')
    const loginRes = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@ubasfintrust.com',
        password: 'StrongPass123!'
      })
    })
    
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`)
    }
    
    const loginData = await loginRes.json()
    const token = loginData.data?.token
    
    if (!token) {
      throw new Error('No token received from login')
    }
    
    console.log('✓ Login successful')

    // Now test the KYC submission with multipart data
    console.log('2. Submitting KYC application...')
    
    const formData = new FormData()
    
    // Add required form fields
    formData.append('personal_firstName', 'John')
    formData.append('personal_lastName', 'Doe')
    formData.append('personal_dateOfBirth', '1990-01-01')
    formData.append('personal_nationality', 'US')
    formData.append('address_street', '123 Test St')
    formData.append('address_city', 'Test City')
    formData.append('address_state', 'Test State')
    formData.append('address_country', 'United States')
    formData.append('employment_status', 'employed')
    formData.append('employment_monthlyIncome', '5000')
    formData.append('agreement_terms', 'true')
    formData.append('agreement_privacy', 'true')
    
    // Add a test document file
    const testFile = new Blob([testImageBuffer], { type: 'image/png' })
    formData.append('document_primaryId', testFile, 'test-id.png')
    
    const kycRes = await fetch(`${API_BASE}/api/v1/kyc/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    const kycData = await kycRes.json()
    
    if (!kycRes.ok) {
      throw new Error(`KYC submission failed: ${kycRes.status} ${JSON.stringify(kycData)}`)
    }
    
    console.log('✓ KYC submission successful!')
    console.log('Response:', JSON.stringify(kycData, null, 2))
    
    return kycData
    
  } catch (error) {
    console.error('Test failed:', error.message)
    return null
  }
}

testKYCSubmission()
