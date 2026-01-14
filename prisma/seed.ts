import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
})

const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Starting database seed...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'admin',
        },
    })
    console.log('✅ Created admin user:', admin.email)

    // Create categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'wedding' },
            update: {},
            create: {
                slug: 'wedding',
                nameEn: 'Wedding',
                nameZhTW: '婚禮',
                descriptionEn: 'Wedding photography services',
                descriptionZhTW: '婚禮攝影服務',
                order: 1,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'portrait' },
            update: {},
            create: {
                slug: 'portrait',
                nameEn: 'Portrait',
                nameZhTW: '人像',
                descriptionEn: 'Portrait photography',
                descriptionZhTW: '人像攝影',
                order: 2,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'product' },
            update: {},
            create: {
                slug: 'product',
                nameEn: 'Product',
                nameZhTW: '商品',
                descriptionEn: 'Product photography',
                descriptionZhTW: '商品攝影',
                order: 3,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'event' },
            update: {},
            create: {
                slug: 'event',
                nameEn: 'Event',
                nameZhTW: '活動',
                descriptionEn: 'Event photography',
                descriptionZhTW: '活動攝影',
                order: 4,
            },
        }),
    ])
    console.log('✅ Created categories:', categories.length)

    // Create services
    const services = await Promise.all([
        prisma.service.upsert({
            where: { slug: 'wedding-photography' },
            update: {},
            create: {
                slug: 'wedding-photography',
                nameEn: 'Wedding Photography',
                nameZhTW: '婚禮攝影',
                descriptionEn: 'Professional wedding photography service with consultation and 500+ edited photos',
                descriptionZhTW: '專業婚禮攝影服務，包含諮詢服務和 500+ 張精修照片',
                price: 'NT$ 30,000',
                duration: '8 hours',
                icon: 'Heart',
                order: 1,
            },
        }),
        prisma.service.upsert({
            where: { slug: 'portrait-photography' },
            update: {},
            create: {
                slug: 'portrait-photography',
                nameEn: 'Portrait Photography',
                nameZhTW: '人像攝影',
                descriptionEn: 'Indoor/outdoor portrait photography sessions',
                descriptionZhTW: '室內/戶外人像攝影',
                price: 'NT$ 5,000',
                duration: '2 hours',
                icon: 'User',
                order: 2,
            },
        }),
        prisma.service.upsert({
            where: { slug: 'corporate-photography' },
            update: {},
            create: {
                slug: 'corporate-photography',
                nameEn: 'Corporate Photography',
                nameZhTW: '企業攝影',
                descriptionEn: 'Corporate headshots and event coverage',
                descriptionZhTW: '企業形象照和活動記錄',
                price: 'NT$ 15,000',
                duration: 'Flexible',
                icon: 'Briefcase',
                order: 3,
            },
        }),
        prisma.service.upsert({
            where: { slug: 'product-photography' },
            update: {},
            create: {
                slug: 'product-photography',
                nameEn: 'Product Photography',
                nameZhTW: '商品攝影',
                descriptionEn: 'Professional product photography for e-commerce',
                descriptionZhTW: '專業商品攝影，適合電商使用',
                price: 'NT$ 8,000',
                duration: 'Half day',
                icon: 'Package',
                order: 4,
            },
        }),
    ])
    console.log('✅ Created services:', services.length)

    // Create sample works
    const weddingCategory = categories.find(c => c.slug === 'wedding')
    const portraitCategory = categories.find(c => c.slug === 'portrait')
    const productCategory = categories.find(c => c.slug === 'product')
    const eventCategory = categories.find(c => c.slug === 'event')

    const works = await Promise.all([
        prisma.work.upsert({
            where: { slug: 'wedding-garden' },
            update: {},
            create: {
                slug: 'wedding-garden',
                titleEn: 'Garden Wedding',
                titleZhTW: '花園婚禮',
                descriptionEn: 'A beautiful outdoor wedding ceremony in a botanical garden',
                descriptionZhTW: '在植物園舉行的美麗戶外婚禮',
                coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
                date: new Date('2023-06-15'),
                location: 'Taipei, Taiwan',
                client: 'Sarah & John',
                featured: true,
                published: true,
                categoryId: weddingCategory?.id,
                order: 1,
            },
        }),
        prisma.work.upsert({
            where: { slug: 'portrait-studio' },
            update: {},
            create: {
                slug: 'portrait-studio',
                titleEn: 'Studio Portrait',
                titleZhTW: '棚拍人像',
                descriptionEn: 'Professional studio portrait session',
                descriptionZhTW: '專業棚拍人像攝影',
                coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
                date: new Date('2023-07-20'),
                location: 'Studio',
                featured: true,
                published: true,
                categoryId: portraitCategory?.id,
                order: 2,
            },
        }),
        prisma.work.upsert({
            where: { slug: 'product-watch' },
            update: {},
            create: {
                slug: 'product-watch',
                titleEn: 'Luxury Watch',
                titleZhTW: '精品手錶',
                descriptionEn: 'High-end product photography for luxury watches',
                descriptionZhTW: '精品手錶商品攝影',
                coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
                date: new Date('2023-08-10'),
                featured: true,
                published: true,
                categoryId: productCategory?.id,
                order: 3,
            },
        }),
        prisma.work.upsert({
            where: { slug: 'event-concert' },
            update: {},
            create: {
                slug: 'event-concert',
                titleEn: 'Music Concert',
                titleZhTW: '音樂會',
                descriptionEn: 'Live concert photography',
                descriptionZhTW: '現場音樂會攝影',
                coverImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
                date: new Date('2023-09-05'),
                location: 'Taipei Arena',
                featured: true,
                published: true,
                categoryId: eventCategory?.id,
                order: 4,
            },
        }),
    ])
    console.log('✅ Created works:', works.length)

    // Add images to works
    for (const work of works) {
        await prisma.image.create({
            data: {
                url: work.coverImage,
                alt: work.titleEn,
                workId: work.id,
                order: 1,
            },
        })
    }
    console.log('✅ Created images for works')

    console.log('🎉 Database seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
